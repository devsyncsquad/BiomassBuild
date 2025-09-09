using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models;
using Biomass.Server.Models.Dispatch;
using Biomass.Server.Models.Vehicle;
using Biomass.Server.Models.Vendor;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
    public class DispatchService : IDispatchService
    {
        private readonly ApplicationDbContext _context;

        public DispatchService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DispatchDto>> GetDispatchesAsync()
        {
            var dispatches = await _context.Dispatches
                .Include(d => d.Vehicle)
                .Include(d => d.Location)
                .OrderByDescending(d => d.CreatedOn)
                .ToListAsync();

            return dispatches.Select(MapToDto).ToList();
        }

        public async Task<DispatchDto?> GetDispatchByIdAsync(int id)
        {
            var dispatch = await _context.Dispatches
                .Include(d => d.Vehicle)
                .Include(d => d.Location)
                .FirstOrDefaultAsync(d => d.DispatchId == id);

            return dispatch != null ? MapToDto(dispatch) : null;
        }

        public async Task<int> CreateDispatchAsync(CreateDispatchRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Find transporter vendor - use provided one or auto-detect
                Vendor? transporterVendor = null;
                
                if (request.TransporterVendorId.HasValue)
                {
                    transporterVendor = await _context.Vendors
                        .FirstOrDefaultAsync(v => v.VendorId == request.TransporterVendorId.Value && v.Status == "Active");
                    
                    if (transporterVendor == null)
                    {
                        throw new InvalidOperationException($"Transporter vendor with ID {request.TransporterVendorId.Value} not found or inactive.");
                    }
                }
                else
                {
                    // Auto-detect transporter vendor where both is_vehicle_loader and is_labour are null
                    transporterVendor = await _context.Vendors
                        .Where(v => v.IsVehicleLoader == null && v.IsLabour == null && v.Status == "Active")
                        .FirstOrDefaultAsync();

                    if (transporterVendor == null)
                    {
                        throw new InvalidOperationException("No transporter vendor found. A vendor with both is_vehicle_loader and is_labour set to null is required.");
                    }
                }

                // Create the dispatch record
                var dispatch = new Dispatch
                {
                    VehicleId = request.VehicleId,
                    LocationId = request.LocationId,
                    MaterialType = request.MaterialType,
                    MaterialRate = request.MaterialRate,
                    SlipNumber = request.SlipNumber,
                    SlipPicture = request.SlipPicture,
                    FirstWeight = request.FirstWeight,
                    SecondWeight = request.SecondWeight,
                    NetWeight = request.NetWeight,
                    LoaderCharges = request.LoaderCharges,
                    LoaderChargesAuto = request.LoaderChargesAuto,
                    LoaderChargesType = request.LoaderChargesType,
                    LaborCharges = request.LaborCharges,
                    LaborChargesAuto = request.LaborChargesAuto,
                    LaborChargesType = request.LaborChargesType,
                    TransporterRate = request.TransporterRate,
                    TransporterRateAuto = request.TransporterRateAuto,
                    TransporterChargesType = request.TransporterChargesType,
                    Amount = request.Amount,
                    TotalDeduction = request.TotalDeduction,
                    CreatedBy = request.CreatedBy,
                    Status = request.Status,
                    PayableWeight = request.PayableWeight,
                    BucketVendorId = request.BucketVendorId,
                    LabourVendorId = request.LabourVendorId,
                    MaterialId = request.MaterialId,
                    TransporterVendorId = request.TransporterVendorId,
                    BucketRatePerMund = request.BucketRatePerMund,
                    LaborRatePerMund = request.LaborRatePerMund,
                    TransporterRatePerMund = request.TransporterRatePerMund,
                    CreatedOn = DateTime.UtcNow
                };

                _context.Dispatches.Add(dispatch);
                await _context.SaveChangesAsync();

                // Calculate charges based on variable rates or fixed amounts
                var bucketCharges = CalculateCharges(request.LoaderCharges, request.BucketRatePerMund, request.NetWeight);
                var laborCharges = CalculateCharges(request.LaborCharges, request.LaborRatePerMund, request.NetWeight);
                var transporterCharges = CalculateCharges(request.TransporterRate, request.TransporterRatePerMund, request.NetWeight);

                // Create AP Ledger entries only for vendors with non-zero amounts
                var apLedgerEntries = new List<ApLedger>();

                // Bucket vendor - only create entry if amount > 0
                if (bucketCharges > 0 && request.BucketVendorId > 0)
                {
                    apLedgerEntries.Add(new ApLedger
                    {
                        VendorId = request.BucketVendorId,
                        HappenedAt = DateTime.UtcNow,
                        EntryKind = "Bill",
                        Amount = bucketCharges,
                        Currency = "PKR",
                        DispatchId = dispatch.DispatchId,
                        Remarks = request.Remarks,
                        CreatedBy = request.CreatedBy,
                        CreatedAt = DateTime.UtcNow,
                        //ReferenceNo = request.VehicleId,
                    });
                }

                // Labour vendor - only create entry if amount > 0
                if (laborCharges > 0 && request.LabourVendorId > 0)
                {
                    apLedgerEntries.Add(new ApLedger
                    {
                        VendorId = request.LabourVendorId,
                        HappenedAt = DateTime.UtcNow,
                        EntryKind = "Bill",
                        Amount = laborCharges,
                        Currency = "PKR",
                        DispatchId = dispatch.DispatchId,
                        Remarks = request.Remarks,
                        CreatedBy = request.CreatedBy,
                        CreatedAt = DateTime.UtcNow,
                        //ReferenceNo = request.VehicleId,
                    });
                }

                // Transporter vendor - only create entry if amount > 0
                if (transporterCharges > 0)
                {
                    apLedgerEntries.Add(new ApLedger
                    {
                        VendorId = transporterVendor.VendorId,
                        HappenedAt = DateTime.UtcNow,
                        EntryKind = "Bill",
                        Amount = transporterCharges,
                        Currency = "PKR",
                        DispatchId = dispatch.DispatchId,
                        Remarks = request.Remarks,
                        CreatedBy = request.CreatedBy,
                        CreatedAt = DateTime.UtcNow,
                        //ReferenceNo = request.VehicleId,
                    });
                }

                // Only add entries if there are any to add
                if (apLedgerEntries.Any())
                {
                    _context.ApLedgers.AddRange(apLedgerEntries);
                }
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return dispatch.DispatchId;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<DispatchDto?> UpdateDispatchAsync(int id, UpdateDispatchRequest request)
        {
            var dispatch = await _context.Dispatches
                .Include(d => d.Vehicle)
                .Include(d => d.Location)
                .FirstOrDefaultAsync(d => d.DispatchId == id);

            if (dispatch == null) return null;

            dispatch.VehicleId = request.VehicleId;
            dispatch.LocationId = request.LocationId;
            dispatch.MaterialType = request.MaterialType;
            dispatch.MaterialRate = request.MaterialRate;
            dispatch.SlipNumber = request.SlipNumber;
            dispatch.SlipPicture = request.SlipPicture;
            dispatch.FirstWeight = request.FirstWeight;
            dispatch.SecondWeight = request.SecondWeight;
            dispatch.NetWeight = request.NetWeight;
            dispatch.LoaderCharges = request.LoaderCharges;
            dispatch.LoaderChargesAuto = request.LoaderChargesAuto;
            dispatch.LoaderChargesType = request.LoaderChargesType;
            dispatch.LaborCharges = request.LaborCharges;
            dispatch.LaborChargesAuto = request.LaborChargesAuto;
            dispatch.LaborChargesType = request.LaborChargesType;
            dispatch.TransporterRate = request.TransporterRate;
            dispatch.TransporterRateAuto = request.TransporterRateAuto;
            dispatch.TransporterChargesType = request.TransporterChargesType;
            dispatch.Amount = request.Amount;
            dispatch.TotalDeduction = request.TotalDeduction;
            dispatch.Status = request.Status;
            dispatch.PayableWeight = request.PayableWeight;
            dispatch.MaterialId = request.MaterialId;
            dispatch.TransporterVendorId = request.TransporterVendorId;
            dispatch.BucketRatePerMund = request.BucketRatePerMund;
            dispatch.LaborRatePerMund = request.LaborRatePerMund;
            dispatch.TransporterRatePerMund = request.TransporterRatePerMund;

            await _context.SaveChangesAsync();
            return MapToDto(dispatch);
        }

        public async Task<bool> DeleteDispatchAsync(int id)
        {
            var dispatch = await _context.Dispatches.FindAsync(id);
            if (dispatch == null) return false;

            _context.Dispatches.Remove(dispatch);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<DispatchDto>> GetDispatchesByUserAndStatusAsync(int userId, string status)
        {
            // Step 1: Get customer IDs assigned to the user
            var customerIds = await _context.UserCustomers
                .Where(uc => uc.UserId == userId && uc.Enabled)
                .Select(uc => uc.CustomerId)
                .ToListAsync();

            if (!customerIds.Any())
            {
                return new List<DispatchDto>(); // Return empty list if user has no assigned customers
            }

            // Step 2: Get location IDs for those customers
            var locationIds = await _context.CustomerLocations
                .Where(l => customerIds.Contains(l.CustomerId) && l.Status == "Active")
                .Select(l => l.LocationId)
                .ToListAsync();

            if (!locationIds.Any())
            {
                return new List<DispatchDto>(); // Return empty list if no locations found
            }

            // Step 3: Get dispatches for those locations with status filter
            var dispatches = await _context.Dispatches
                .Include(d => d.Vehicle)
                .Include(d => d.Location)
                .Where(d => locationIds.Contains(d.LocationId) && d.Status == status)
                .OrderByDescending(d => d.CreatedOn)
                .ToListAsync();

            return dispatches.Select(MapToDto).ToList();
        }

        private static DispatchDto MapToDto(Dispatch dispatch)
        {
            return new DispatchDto
            {
                DispatchId = dispatch.DispatchId,
                VehicleId = dispatch.VehicleId,
                LocationId = dispatch.LocationId,
                MaterialType = dispatch.MaterialType,
                MaterialRate = dispatch.MaterialRate,
                SlipNumber = dispatch.SlipNumber,
                SlipPicture = dispatch.SlipPicture,
                FirstWeight = dispatch.FirstWeight,
                SecondWeight = dispatch.SecondWeight,
                NetWeight = dispatch.NetWeight,
                LoaderCharges = dispatch.LoaderCharges,
                LoaderChargesAuto = dispatch.LoaderChargesAuto,
                LoaderChargesType = dispatch.LoaderChargesType,
                LaborCharges = dispatch.LaborCharges,
                LaborChargesAuto = dispatch.LaborChargesAuto,
                LaborChargesType = dispatch.LaborChargesType,
                TransporterRate = dispatch.TransporterRate,
                TransporterRateAuto = dispatch.TransporterRateAuto,
                TransporterChargesType = dispatch.TransporterChargesType,
                Amount = dispatch.Amount,
                TotalDeduction = dispatch.TotalDeduction,
                CreatedBy = dispatch.CreatedBy,
                CreatedOn = dispatch.CreatedOn,
                Status = dispatch.Status,
                PayableWeight = dispatch.PayableWeight,
                MaterialId = dispatch.MaterialId,
                TransporterVendorId = dispatch.TransporterVendorId,
                BucketRatePerMund = dispatch.BucketRatePerMund,
                LaborRatePerMund = dispatch.LaborRatePerMund,
                TransporterRatePerMund = dispatch.TransporterRatePerMund,
                Vehicle = dispatch.Vehicle != null ? new VehicleDto
                {
                    VehicleId = dispatch.Vehicle.VehicleId,
                    VehicleNumber = dispatch.Vehicle.VehicleNumber,
                    VehicleType = dispatch.Vehicle.VehicleType,
                    Capacity = dispatch.Vehicle.Capacity,
                    FuelType = dispatch.Vehicle.FuelType,
                    Status = dispatch.Vehicle.Status,
                    CreatedOn = dispatch.Vehicle.CreatedOn,
                    VehicleRegNumber = dispatch.Vehicle.VehicleRegNumber,
                    VendorId = dispatch.Vehicle.VendorId,
                    CostCenterId= dispatch.Vehicle.CostCenterId

                } : null,
                Location = dispatch.Location
            };
        }

        /// <summary>
        /// Calculates charges based on either fixed amount or variable rate per mund
        /// </summary>
        /// <param name="fixedAmount">Fixed charge amount (nullable)</param>
        /// <param name="ratePerMund">Rate per mund for variable calculation (nullable)</param>
        /// <param name="netWeight">Net weight in munds</param>
        /// <returns>Calculated charge amount</returns>
        private static decimal CalculateCharges(decimal? fixedAmount, decimal? ratePerMund, decimal netWeight)
        {
            // If variable rate is provided, use it for calculation
            if (ratePerMund.HasValue)
            {
                return ratePerMund.Value * netWeight;
            }
            
            // Otherwise, use fixed amount (default to 0 if null)
            return fixedAmount ?? 0;
        }
//>>>>>>> dispatch_02
    }
}
