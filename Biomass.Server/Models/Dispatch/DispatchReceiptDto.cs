using System.ComponentModel.DataAnnotations;
using Biomass.Server.Models.Vehicle;
using Biomass.Server.Models.Vendor;

namespace Biomass.Server.Models.Dispatch
{
    /// <summary>
    /// DTO for DispatchReceipt data transfer
    /// </summary>
    public class DispatchReceiptDto
    {
        public long ReceiptId { get; set; }
        public int DispatchId { get; set; }
        public int VendorId { get; set; }
        public int? VehicleId { get; set; }
        public string? SlipNumber { get; set; }
        public string? SlipImageUrl { get; set; }
        public decimal? WeightGross { get; set; }
        public decimal? WeightTare { get; set; }
        public decimal? WeightNet { get; set; }
        public int? MaterialTypeId { get; set; }
        public decimal? MaterialRate { get; set; }
        public decimal? AmountGross { get; set; }
        public decimal PenaltyAmount { get; set; }
        public decimal OtherDeduction { get; set; }
        public decimal AdvancesApplied { get; set; }
        public decimal? AmountPayable { get; set; }
        public string? Remarks { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PostedAt { get; set; }
        public string? FilesUrl { get; set; }

        // Navigation properties
        public DispatchDto? Dispatch { get; set; }
        public VendorDto? Vendor { get; set; }
        public VehicleDto? Vehicle { get; set; }
    }

    /// <summary>
    /// Request model for creating a new dispatch receipt
    /// </summary>
    public class CreateDispatchReceiptRequest
    {
        [Required]
        public int DispatchId { get; set; }

        [Required]
        public int VendorId { get; set; }

        public int? VehicleId { get; set; }

        [StringLength(100)]
        public string? SlipNumber { get; set; }

        [StringLength(500)]
        public string? SlipImageUrl { get; set; }

        public decimal? WeightGross { get; set; }

        public decimal? WeightTare { get; set; }

        public decimal? WeightNet { get; set; }

        public int? MaterialTypeId { get; set; }

        public decimal? MaterialRate { get; set; }

        public decimal? AmountGross { get; set; }

        public decimal PenaltyAmount { get; set; } = 0;

        public decimal OtherDeduction { get; set; } = 0;

        public decimal AdvancesApplied { get; set; } = 0;

        public decimal? AmountPayable { get; set; }

        [StringLength(500)]
        public string? Remarks { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Draft";

        [Required]
        public int CreatedBy { get; set; }

        [StringLength(500)]
        public string? FilesUrl { get; set; }

        public bool? BiltyReceived { get; set; }

        // For file upload handling in multipart/form-data
        public IFormFile? SlipImageFile { get; set; }
    }

    /// <summary>
    /// Request model for updating an existing dispatch receipt
    /// </summary>
    public class UpdateDispatchReceiptRequest
    {
        [Required]
        public int DispatchId { get; set; }

        [Required]
        public int VendorId { get; set; }

        public int? VehicleId { get; set; }

        [StringLength(100)]
        public string? SlipNumber { get; set; }

        [StringLength(500)]
        public string? SlipImageUrl { get; set; }

        public decimal? WeightGross { get; set; }

        public decimal? WeightTare { get; set; }

        public decimal? WeightNet { get; set; }

        public int? MaterialTypeId { get; set; }

        public decimal? MaterialRate { get; set; }

        public decimal? AmountGross { get; set; }

        public decimal PenaltyAmount { get; set; }

        public decimal OtherDeduction { get; set; }

        public decimal AdvancesApplied { get; set; }

        public decimal? AmountPayable { get; set; }

        [StringLength(500)]
        public string? Remarks { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = string.Empty;

        [StringLength(500)]
        public string? FilesUrl { get; set; }

        public bool? BiltyReceived { get; set; }
    }
}
