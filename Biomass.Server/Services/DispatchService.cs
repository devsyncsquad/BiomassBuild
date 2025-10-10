using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models;
using Biomass.Server.Models.Customer;
using Biomass.Server.Models.Dispatch;
using Biomass.Server.Models.Vehicle;
using Biomass.Server.Models.Vendor;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Services
{
    public class DispatchService : IDispatchService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private  string _dispatchUploadsFolder;

        public DispatchService(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
            
        }

        public async Task<List<DispatchDto>> GetDispatchesAsync()
        {
            var dispatches = await _context.VDispatches
                .OrderByDescending(d => d.CreatedOn)
                .ToListAsync();

            return dispatches.Select(MapToDtoFromView).ToList();
        }

        public async Task<DispatchDto?> GetDispatchByIdAsync(int id)
        {
            var dispatch = await _context.VDispatches
                .FirstOrDefaultAsync(d => d.DispatchId == id);

            return dispatch != null ? MapToDtoFromView(dispatch) : null;
        }

        public async Task<int> CreateDispatchAsync(CreateDispatchRequest request)
        {
            Console.WriteLine($"🚀 CreateDispatchAsync called");
            Console.WriteLine($"📦 VehicleId: {request.VehicleId}, LocationId: {request.LocationId}");
            Console.WriteLine($"📦 SlipNumber: {request.SlipNumber}");
            Console.WriteLine($"📦 CashIds NULL CHECK: {(request.CashIds == null ? "NULL" : "NOT NULL")}");
            Console.WriteLine($"📦 CashIds Count: {request.CashIds?.Count ?? 0}");
            if (request.CashIds != null && request.CashIds.Any())
            {
                Console.WriteLine($"📦 CashIds VALUES: [{string.Join(", ", request.CashIds)}]");
            }
            else
            {
                Console.WriteLine($"📦 CashIds: EMPTY OR NULL!");
            }
            
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                Console.WriteLine("✅ Transaction started");
                
                // Use the uploads folder in ContentRootPath (same level as wwwroot)
                // This matches the existing pattern used for cashbook_receipts
                _dispatchUploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads", "dispatches");
                Console.WriteLine($"📁 Dispatch uploads folder: {_dispatchUploadsFolder}");
                
                // Create dispatch uploads directory if it doesn't exist
                if (!Directory.Exists(_dispatchUploadsFolder))
                {
                    try
                    {
                        Directory.CreateDirectory(_dispatchUploadsFolder);
                        Console.WriteLine("✅ Created dispatch uploads folder");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"⚠️ Could not create dispatch uploads folder: {ex.Message}");
                        Console.WriteLine($"⚠️ Ensure the folder exists and has proper permissions");
                    }
                }

                // Handle slip picture upload if provided
                string? slipPicturePath = null;
                if (request.SlipPictureFile != null)
                {
                    slipPicturePath = await SaveSlipPictureFileAsync(request.SlipPictureFile);
                }
                else if (!string.IsNullOrEmpty(request.SlipPicture))
                {
                    // If SlipPicture path is already provided (not from file upload), use it as is
                    slipPicturePath = request.SlipPicture;
                }
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

                // Only check for duplicate slip number if one is provided
                if (!string.IsNullOrWhiteSpace(request.SlipNumber))
                {
                    Console.WriteLine($"🔍 Checking if slip number '{request.SlipNumber}' exists...");
                    var slipExists = await _context.Dispatches
                        .Where(v => v.SlipNumber == request.SlipNumber)
                        .AnyAsync();
                    if (slipExists) {
                        Console.WriteLine($"❌ Slip number {request.SlipNumber} already exists");
                        throw new InvalidOperationException($"Slip number {request.SlipNumber} is already added in system.");
                    }
                    Console.WriteLine("✅ Slip number is unique");
                }
                else
                {
                    Console.WriteLine("⚠️ No slip number provided, skipping duplicate check");
                }
                        

                // Calculate PayableWeightMund based on PayableWeight
                var payableWeightMund = request.PayableWeight.HasValue && request.PayableWeight > 0 ? Math.Floor((decimal)request.PayableWeight.Value / 40) : 0;

                // Create the dispatch record
                var dispatch = new Dispatch
                {
                    VehicleId = request.VehicleId,
                    LocationId = request.LocationId,
                    MaterialType = request.MaterialType,
                    MaterialRate = request.MaterialRate,
                    SlipNumber = request.SlipNumber,
                    SlipPicture = slipPicturePath,
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
                    PayableWeightMund = payableWeightMund,
                    BucketVendorId = request.BucketVendorId,
                    LabourVendorId = request.LabourVendorId,
                    MaterialId = request.MaterialId,
                    TransporterVendorId = request.TransporterVendorId,
                    BucketRatePerMund = request.BucketRatePerMund,
                    LaborRatePerMund = request.LaborRatePerMund,
                    TransporterRatePerMund = request.TransporterRatePerMund,
                    CreatedOn = DateTime.UtcNow
                };

                Console.WriteLine("💾 Saving dispatch to database...");
                _context.Dispatches.Add(dispatch);
                await _context.SaveChangesAsync();
                Console.WriteLine($"✅ Dispatch created with ID: {dispatch.DispatchId}");

                // Calculate charges based on variable rates or fixed amounts
                var bucketCharges = CalculateCharges(request.LoaderCharges, request.BucketRatePerMund, request.NetWeight);
                var laborCharges = CalculateCharges(request.LaborCharges, request.LaborRatePerMund, request.NetWeight);
                var transporterCharges = CalculateCharges(request.TransporterRate, request.TransporterRatePerMund, request.NetWeight);

                // Create AP Ledger entries only for vendors with non-zero amounts
                var apLedgerEntries = new List<ApLedger>();

                // Bucket vendor - only create entry if amount > 0 and vendor ID is provided and valid
                if (bucketCharges > 0 && request.BucketVendorId.HasValue && request.BucketVendorId.Value > 0)
                {
                    apLedgerEntries.Add(new ApLedger
                    {
                        VendorId = request.BucketVendorId.Value,
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

                // Labour vendor - only create entry if amount > 0 and vendor ID is provided and valid
                if (laborCharges > 0 && request.LabourVendorId.HasValue && request.LabourVendorId.Value > 0)
                {
                    apLedgerEntries.Add(new ApLedger
                    {
                        VendorId = request.LabourVendorId.Value,
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
                        //SlipNumber = request.SlipNumber
                        CreatedAt = DateTime.UtcNow
                        //ReferenceNo = request.VehicleId,
                    });
                }

                // Only add entries if there are any to add
                if (apLedgerEntries.Any())
                {
                    _context.ApLedgers.AddRange(apLedgerEntries);
                }
                await _context.SaveChangesAsync();

                // Update cashbook entries with dispatch_id if CashIds are provided
                if (request.CashIds != null && request.CashIds.Any())
                {
                    Console.WriteLine($"💰 Processing {request.CashIds.Count} CashIds...");
                    
                    // Validate that all cash_ids exist and don't already have a dispatch_id
                    Console.WriteLine($"🔍 Querying cashbook for IDs: {string.Join(", ", request.CashIds)}");
                    var existingCashbookEntries = await _context.Cashbooks
                        .Where(c => request.CashIds.Contains(c.CashId))
                        .ToListAsync();
                    
                    Console.WriteLine($"✅ Found {existingCashbookEntries.Count} cashbook entries");

                    var providedCashIds = request.CashIds.ToHashSet();
                    var foundCashIds = existingCashbookEntries.Select(c => c.CashId).ToHashSet();
                    var missingCashIds = providedCashIds.Except(foundCashIds).ToList();

                    if (missingCashIds.Any())
                    {
                        Console.WriteLine($"❌ Missing Cash IDs: {string.Join(", ", missingCashIds)}");
                        throw new InvalidOperationException($"Cash IDs not found: {string.Join(", ", missingCashIds)}");
                    }
                    Console.WriteLine("✅ All CashIds found");

                    // Check if any cashbook entries already have a dispatch_id
                    var entriesWithDispatch = existingCashbookEntries
                        .Where(c => c.DispatchId.HasValue)
                        .Select(c => c.CashId)
                        .ToList();

                    if (entriesWithDispatch.Any())
                    {
                        Console.WriteLine($"❌ CashIds already have dispatch: {string.Join(", ", entriesWithDispatch)}");
                        throw new InvalidOperationException($"Cash IDs already have dispatch assigned: {string.Join(", ", entriesWithDispatch)}");
                    }
                    Console.WriteLine("✅ No CashIds have existing dispatch");

                    // Update cashbook entries with the new dispatch_id
                    Console.WriteLine($"💾 Updating {existingCashbookEntries.Count} cashbook entries with DispatchId: {dispatch.DispatchId}");
                    foreach (var cashbookEntry in existingCashbookEntries)
                    {
                        Console.WriteLine($"   Updating CashId {cashbookEntry.CashId}: DispatchId = {dispatch.DispatchId}");
                        cashbookEntry.DispatchId = dispatch.DispatchId;
                    }

                    Console.WriteLine("💾 Saving cashbook updates...");
                    await _context.SaveChangesAsync();
                    Console.WriteLine("✅ Cashbook entries updated successfully");
                }

                Console.WriteLine("✅ Committing transaction...");
                await transaction.CommitAsync();
                Console.WriteLine($"✅✅✅ Dispatch {dispatch.DispatchId} created successfully!");
                return dispatch.DispatchId;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌❌❌ ERROR in CreateDispatchAsync: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                await transaction.RollbackAsync();
                Console.WriteLine("🔄 Transaction rolled back");
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

            // Calculate PayableWeightMund based on PayableWeight
            var payableWeightMund = request.PayableWeight.HasValue && request.PayableWeight > 0 ? Math.Floor((decimal)request.PayableWeight.Value / 40) : 0;

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
            dispatch.PayableWeightMund = payableWeightMund;
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
            var dispatches = await _context.VDispatches
                .Where(d => locationIds.Contains(d.LocationId) && d.Status == status)
                .OrderByDescending(d => d.CreatedOn)
                .ToListAsync();

            return dispatches.Select(MapToDtoFromView).ToList();
        }

        public async Task<List<DispatchDto>> GetDispatchesBySlipNumberAsync(string slipNumber)
        {
            // Get dispatches matching the slip number
            var dispatches = await _context.VDispatches
                .Where(d => d.SlipNumber == slipNumber)
                .OrderByDescending(d => d.CreatedOn)
                .ToListAsync();

            return dispatches.Select(MapToDtoFromView).ToList();
        }

        private static DispatchDto MapToDtoFromView(VDispatchDto vDispatch)
        {
            return new DispatchDto
            {
                DispatchId = vDispatch.DispatchId,
                VehicleId = vDispatch.VehicleId,
                LocationId = vDispatch.LocationId,
                MaterialType = vDispatch.MaterialType,
                MaterialRate = vDispatch.MaterialRate,
                SlipNumber = vDispatch.SlipNumber,
                SlipPicture = vDispatch.SlipPicture,
                FirstWeight = vDispatch.FirstWeight,
                SecondWeight = vDispatch.SecondWeight,
                NetWeight = vDispatch.NetWeight,
                LoaderCharges = vDispatch.LoaderCharges,
                LoaderChargesAuto = vDispatch.LoaderChargesAuto,
                LoaderChargesType = vDispatch.LoaderChargesType,
                LaborCharges = vDispatch.LaborCharges,
                LaborChargesAuto = vDispatch.LaborChargesAuto,
                LaborChargesType = vDispatch.LaborChargesType,
                TransporterRate = vDispatch.TransporterRate,
                TransporterRateAuto = vDispatch.TransporterRateAuto,
                TransporterChargesType = vDispatch.TransporterChargesType,
                Amount = vDispatch.Amount,
                DispatchDeduction = vDispatch.DispatchDeduction,
                CreatedBy = vDispatch.CreatedBy,
                CreatedOn = vDispatch.CreatedOn,
                Status = vDispatch.Status,
                PayableWeight = vDispatch.PayableWeight,
                PayableWeightMund = vDispatch.PayableWeightMund,
                BucketVendorId = vDispatch.BucketVendorId,
                LabourVendorId = vDispatch.LabourVendorId,
                TransporterVendorId=vDispatch.TransporterVendorId,
                MaterialId=vDispatch.MaterialId,
                TotalDeduction=vDispatch.TotalDeduction,
                InTransitExpenses=vDispatch.InTransitExpenses,

        Vehicle = new VehicleDto
                {
                    VehicleId = vDispatch.VehicleId,
                    VehicleNumber = vDispatch.VehicleNumber,
                    CostCenterId = vDispatch.CostCenterId
                },
                Location = new CustomerLocation
                {
                    LocationId = vDispatch.LocationId,
                    LocationName = vDispatch.LocationName ?? string.Empty,
                    ToleranceLimitKg = vDispatch.ToleranceLimitKg,
                    ToleranceLimitPercentage = vDispatch.ToleranceLimitPercentage,
                    AdvancePercentageAllowed = vDispatch.AdvancePercentageAllowed,
                    CenterDispatchWeightLimit = vDispatch.CenterDispatchWeightLimit,
                    MaterialPenaltyRatePerKg = vDispatch.MaterialPenaltyRatePerKg
                }
            };
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
                PayableWeightMund = dispatch.PayableWeightMund,
                MaterialId = dispatch.MaterialId,
                TransporterVendorId = dispatch.TransporterVendorId,
                BucketVendorId = dispatch.BucketVendorId,
                LabourVendorId = dispatch.LabourVendorId,
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

        /// <summary>
        /// Saves slip picture file to dispatches folder
        /// </summary>
        /// <param name="file">The uploaded slip picture file</param>
        /// <returns>Relative file path</returns>
        private async Task<string> SaveSlipPictureFileAsync(IFormFile file)
        {
            // Validate file size (10MB limit)
            if (file.Length > 10 * 1024 * 1024)
            {
                throw new InvalidOperationException("File size cannot exceed 10MB");
            }

            // Validate file type
            var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new InvalidOperationException("Only PDF, JPG, and PNG files are allowed");
            }

            // Generate unique filename
            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
            var fileName = $"slip_{timestamp}_{Guid.NewGuid().ToString("N")[..8]}{fileExtension}";
            var filePath = Path.Combine(_dispatchUploadsFolder, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative path for database storage
            return $"/uploads/dispatches/{fileName}";
        }
//>>>>>>> dispatch_02
    }
}
