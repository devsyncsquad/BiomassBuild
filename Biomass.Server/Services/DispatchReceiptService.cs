using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Dispatch;
using Biomass.Server.Models.Vehicle;
using Biomass.Server.Models.Vendor;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;

namespace Biomass.Server.Services
{
    /// <summary>
    /// Service for managing dispatch receipts
    /// </summary>
    public class DispatchReceiptService : IDispatchReceiptService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly string _receiptUploadsFolder;

        public DispatchReceiptService(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
            _receiptUploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "dispatch_receipts");
            // Create dispatch receipt uploads directory if it doesn't exist
            if (!Directory.Exists(_receiptUploadsFolder))
            {
                Directory.CreateDirectory(_receiptUploadsFolder);
            }
        }

        public async Task<long> CreateDispatchReceiptAsync(CreateDispatchReceiptRequest request)
        {
            // Handle slip image upload if provided
            string? slipImagePath = null;
            if (request.SlipImageFile != null)
            {
                slipImagePath = await SaveSlipImageFileAsync(request.SlipImageFile);
            }
            else if (!string.IsNullOrEmpty(request.SlipImageUrl))
            {
                // If SlipImageUrl path is already provided (not from file upload), use it as is
                slipImagePath = request.SlipImageUrl;
            }

            // Validate that dispatch exists
            var dispatchExists = await _context.Dispatches
                .AnyAsync(d => d.DispatchId == request.DispatchId);
            
            if (!dispatchExists)
            {
                throw new InvalidOperationException($"Dispatch with ID {request.DispatchId} not found.");
            }

            // Validate that vendor exists
            var vendorExists = await _context.Vendors
                .AnyAsync(v => v.VendorId == request.VendorId && v.Status == "Active");
            
            if (!vendorExists)
            {
                throw new InvalidOperationException($"Vendor with ID {request.VendorId} not found or inactive.");
            }

            // Validate vehicle if provided
            if (request.VehicleId.HasValue)
            {
                var vehicleExists = await _context.Vehicles
                    .AnyAsync(v => v.VehicleId == request.VehicleId.Value);
                
                if (!vehicleExists)
                {
                    throw new InvalidOperationException($"Vehicle with ID {request.VehicleId.Value} not found.");
                }
            }

            // Calculate amount payable if not provided
            var amountPayable = request.AmountPayable;
            if (!amountPayable.HasValue && request.AmountGross.HasValue)
            {
                amountPayable = request.AmountGross.Value - request.PenaltyAmount - request.OtherDeduction - request.AdvancesApplied;
            }

            var dispatchReceipt = new DispatchReceipt
            {
                DispatchId = request.DispatchId,
                VendorId = request.VendorId,
                VehicleId = request.VehicleId,
                SlipNumber = request.SlipNumber,
                SlipImageUrl = slipImagePath,
                WeightGross = request.WeightGross,
                WeightTare = request.WeightTare,
                WeightNet = request.WeightNet,
                MaterialTypeId = request.MaterialTypeId,
                MaterialRate = request.MaterialRate,
                AmountGross = request.AmountGross,
                PenaltyAmount = request.PenaltyAmount,
                OtherDeduction = request.OtherDeduction,
                AdvancesApplied = request.AdvancesApplied,
                AmountPayable = amountPayable,
                Remarks = request.Remarks,
                Status = "Received",
                CreatedBy = request.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                FilesUrl = request.FilesUrl,
                BiltyReceived=request.BiltyReceived
            };

            _context.DispatchReceipts.Add(dispatchReceipt);
            
            // Update the dispatch status to "Received"
            var dispatch = await _context.Dispatches.FindAsync(request.DispatchId);
            if (dispatch != null)
            {
                dispatch.Status = "Received";
            }
            
            await _context.SaveChangesAsync();

            return dispatchReceipt.ReceiptId;
        }

        public async Task<DispatchReceiptDto?> UpdateDispatchReceiptAsync(long id, UpdateDispatchReceiptRequest request)
        {
            var dispatchReceipt = await _context.DispatchReceipts
                .Include(dr => dr.Dispatch)
                .Include(dr => dr.Vendor)
                .Include(dr => dr.Vehicle)
                .FirstOrDefaultAsync(dr => dr.ReceiptId == id);

            if (dispatchReceipt == null)
            {
                return null;
            }

            // Validate that dispatch exists
            var dispatchExists = await _context.Dispatches
                .AnyAsync(d => d.DispatchId == request.DispatchId);
            
            if (!dispatchExists)
            {
                throw new InvalidOperationException($"Dispatch with ID {request.DispatchId} not found.");
            }

            // Validate that vendor exists
            var vendorExists = await _context.Vendors
                .AnyAsync(v => v.VendorId == request.VendorId && v.Status == "Active");
            
            if (!vendorExists)
            {
                throw new InvalidOperationException($"Vendor with ID {request.VendorId} not found or inactive.");
            }

            // Validate vehicle if provided
            if (request.VehicleId.HasValue)
            {
                var vehicleExists = await _context.Vehicles
                    .AnyAsync(v => v.VehicleId == request.VehicleId.Value);
                
                if (!vehicleExists)
                {
                    throw new InvalidOperationException($"Vehicle with ID {request.VehicleId.Value} not found.");
                }
            }

            // Update fields
            dispatchReceipt.DispatchId = request.DispatchId;
            dispatchReceipt.VendorId = request.VendorId;
            dispatchReceipt.VehicleId = request.VehicleId;
            dispatchReceipt.SlipNumber = request.SlipNumber;
            dispatchReceipt.SlipImageUrl = request.SlipImageUrl;
            dispatchReceipt.WeightGross = request.WeightGross;
            dispatchReceipt.WeightTare = request.WeightTare;
            dispatchReceipt.WeightNet = request.WeightNet;
            dispatchReceipt.MaterialTypeId = request.MaterialTypeId;
            dispatchReceipt.MaterialRate = request.MaterialRate;
            dispatchReceipt.AmountGross = request.AmountGross;
            dispatchReceipt.PenaltyAmount = request.PenaltyAmount;
            dispatchReceipt.OtherDeduction = request.OtherDeduction;
            dispatchReceipt.AdvancesApplied = request.AdvancesApplied;
            dispatchReceipt.Remarks = request.Remarks;
            dispatchReceipt.Status = request.Status;
            dispatchReceipt.FilesUrl = request.FilesUrl;
            dispatchReceipt.BiltyReceived = request.BiltyReceived;

            // Calculate amount payable if not provided
            if (!request.AmountPayable.HasValue && request.AmountGross.HasValue)
            {
                dispatchReceipt.AmountPayable = request.AmountGross.Value - request.PenaltyAmount - request.OtherDeduction - request.AdvancesApplied;
            }
            else
            {
                dispatchReceipt.AmountPayable = request.AmountPayable;
            }

            // Update posted_at if status is changing to Posted
            if (request.Status == "Posted" && dispatchReceipt.Status != "Posted")
            {
                dispatchReceipt.PostedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return MapToDto(dispatchReceipt);
        }

        public async Task<DispatchReceiptDto?> GetDispatchReceiptByIdAsync(long id)
        {
            var dispatchReceipt = await _context.DispatchReceipts
                .Include(dr => dr.Dispatch)
                .Include(dr => dr.Vendor)
                .Include(dr => dr.Vehicle)
                .FirstOrDefaultAsync(dr => dr.ReceiptId == id);

            return dispatchReceipt != null ? MapToDto(dispatchReceipt) : null;
        }

        public async Task<List<DispatchReceiptDto>> GetDispatchReceiptsAsync()
        {
            var dispatchReceipts = await _context.DispatchReceipts
                .Include(dr => dr.Dispatch)
                .Include(dr => dr.Vendor)
                .Include(dr => dr.Vehicle)
                .OrderByDescending(dr => dr.CreatedAt)
                .ToListAsync();

            return dispatchReceipts.Select(MapToDto).ToList();
        }

        public async Task<List<DispatchReceiptDto>> GetDispatchReceiptsByDispatchIdAsync(int dispatchId)
        {
            var dispatchReceipts = await _context.DispatchReceipts
                .Include(dr => dr.Dispatch)
                .Include(dr => dr.Vendor)
                .Include(dr => dr.Vehicle)
                .Where(dr => dr.DispatchId == dispatchId)
                .OrderByDescending(dr => dr.CreatedAt)
                .ToListAsync();

            return dispatchReceipts.Select(MapToDto).ToList();
        }

        public async Task<bool> DeleteDispatchReceiptAsync(long id)
        {
            var dispatchReceipt = await _context.DispatchReceipts.FindAsync(id);
            if (dispatchReceipt == null)
            {
                return false;
            }

            _context.DispatchReceipts.Remove(dispatchReceipt);
            await _context.SaveChangesAsync();
            return true;
        }

        private static DispatchReceiptDto MapToDto(DispatchReceipt dispatchReceipt)
        {
            return new DispatchReceiptDto
            {
                ReceiptId = dispatchReceipt.ReceiptId,
                DispatchId = dispatchReceipt.DispatchId,
                VendorId = dispatchReceipt.VendorId,
                VehicleId = dispatchReceipt.VehicleId,
                SlipNumber = dispatchReceipt.SlipNumber,
                SlipImageUrl = dispatchReceipt.SlipImageUrl,
                WeightGross = dispatchReceipt.WeightGross,
                WeightTare = dispatchReceipt.WeightTare,
                WeightNet = dispatchReceipt.WeightNet,
                MaterialTypeId = dispatchReceipt.MaterialTypeId,
                MaterialRate = dispatchReceipt.MaterialRate,
                AmountGross = dispatchReceipt.AmountGross,
                PenaltyAmount = dispatchReceipt.PenaltyAmount,
                OtherDeduction = dispatchReceipt.OtherDeduction,
                AdvancesApplied = dispatchReceipt.AdvancesApplied,
                AmountPayable = dispatchReceipt.AmountPayable,
                Remarks = dispatchReceipt.Remarks,
                Status = dispatchReceipt.Status,
                CreatedBy = dispatchReceipt.CreatedBy,
                CreatedAt = dispatchReceipt.CreatedAt,
                PostedAt = dispatchReceipt.PostedAt,
                FilesUrl = dispatchReceipt.FilesUrl,
                Dispatch = dispatchReceipt.Dispatch != null ? new DispatchDto
                {
                    DispatchId = dispatchReceipt.Dispatch.DispatchId,
                    VehicleId = dispatchReceipt.Dispatch.VehicleId,
                    LocationId = dispatchReceipt.Dispatch.LocationId,
                    MaterialType = dispatchReceipt.Dispatch.MaterialType,
                    MaterialRate = dispatchReceipt.Dispatch.MaterialRate,
                    SlipNumber = dispatchReceipt.Dispatch.SlipNumber,
                    SlipPicture = dispatchReceipt.Dispatch.SlipPicture,
                    FirstWeight = dispatchReceipt.Dispatch.FirstWeight,
                    SecondWeight = dispatchReceipt.Dispatch.SecondWeight,
                    NetWeight = dispatchReceipt.Dispatch.NetWeight,
                    LoaderCharges = dispatchReceipt.Dispatch.LoaderCharges,
                    LoaderChargesAuto = dispatchReceipt.Dispatch.LoaderChargesAuto,
                    LoaderChargesType = dispatchReceipt.Dispatch.LoaderChargesType,
                    LaborCharges = dispatchReceipt.Dispatch.LaborCharges,
                    LaborChargesAuto = dispatchReceipt.Dispatch.LaborChargesAuto,
                    LaborChargesType = dispatchReceipt.Dispatch.LaborChargesType,
                    TransporterRate = dispatchReceipt.Dispatch.TransporterRate,
                    TransporterRateAuto = dispatchReceipt.Dispatch.TransporterRateAuto,
                    TransporterChargesType = dispatchReceipt.Dispatch.TransporterChargesType,
                    Amount = dispatchReceipt.Dispatch.Amount,
                    TotalDeduction = dispatchReceipt.Dispatch.TotalDeduction,
                    CreatedBy = dispatchReceipt.Dispatch.CreatedBy,
                    CreatedOn = dispatchReceipt.Dispatch.CreatedOn,
                    Status = dispatchReceipt.Dispatch.Status,
                    PayableWeight = dispatchReceipt.Dispatch.PayableWeight,
                    MaterialId = dispatchReceipt.Dispatch.MaterialId,
                    TransporterVendorId = dispatchReceipt.Dispatch.TransporterVendorId,
                    BucketVendorId = dispatchReceipt.Dispatch.BucketVendorId,
                    LabourVendorId = dispatchReceipt.Dispatch.LabourVendorId,
                    BucketRatePerMund = dispatchReceipt.Dispatch.BucketRatePerMund,
                    LaborRatePerMund = dispatchReceipt.Dispatch.LaborRatePerMund,
                    TransporterRatePerMund = dispatchReceipt.Dispatch.TransporterRatePerMund
                } : null,
                Vendor = dispatchReceipt.Vendor != null ? new VendorDto
                {
                    VendorId = dispatchReceipt.Vendor.VendorId,
                    VendorName = dispatchReceipt.Vendor.VendorName,
                    Address = dispatchReceipt.Vendor.Address,
                    Phone1 = dispatchReceipt.Vendor.Phone1,
                    Phone2 = dispatchReceipt.Vendor.Phone2,
                    Phone3 = dispatchReceipt.Vendor.Phone3,
                    VendorCnicFrontPic = dispatchReceipt.Vendor.VendorCnicFrontPic,
                    VendorCnicBackPic = dispatchReceipt.Vendor.VendorCnicBackPic,
                    Cnic = dispatchReceipt.Vendor.Cnic,
                    Status = dispatchReceipt.Vendor.Status,
                    IsVehicleLoader = dispatchReceipt.Vendor.IsVehicleLoader,
                    IsLabour = dispatchReceipt.Vendor.IsLabour
                } : null,
                Vehicle = dispatchReceipt.Vehicle != null ? new VehicleDto
                {
                    VehicleId = dispatchReceipt.Vehicle.VehicleId,
                    VehicleNumber = dispatchReceipt.Vehicle.VehicleNumber,
                    VehicleType = dispatchReceipt.Vehicle.VehicleType,
                    Capacity = dispatchReceipt.Vehicle.Capacity,
                    FuelType = dispatchReceipt.Vehicle.FuelType,
                    Status = dispatchReceipt.Vehicle.Status,
                    CreatedOn = dispatchReceipt.Vehicle.CreatedOn,
                    VehicleRegNumber = dispatchReceipt.Vehicle.VehicleRegNumber,
                    VendorId = dispatchReceipt.Vehicle.VendorId,
                    CostCenterId = dispatchReceipt.Vehicle.CostCenterId
                } : null
            };
        }

        /// <summary>
        /// Saves slip image file to dispatch receipts folder
        /// </summary>
        /// <param name="file">The uploaded slip image file</param>
        /// <returns>Relative file path</returns>
        private async Task<string> SaveSlipImageFileAsync(IFormFile file)
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
            var fileName = $"receipt_slip_{timestamp}_{Guid.NewGuid().ToString("N")[..8]}{fileExtension}";
            var filePath = Path.Combine(_receiptUploadsFolder, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative path for database storage
            return $"/uploads/dispatch_receipts/{fileName}";
        }
    }
}
