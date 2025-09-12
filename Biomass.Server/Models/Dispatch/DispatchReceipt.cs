using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Biomass.Server.Models.Vendor;
using Biomass.Server.Models.Vehicle;

namespace Biomass.Server.Models.Dispatch
{
    /// <summary>
    /// Model representing the dispatch_receipts table
    /// </summary>
    public class DispatchReceipt
    {
        [Key]
        [Column("receipt_id")]
        public long ReceiptId { get; set; }

        [Required]
        [Column("dispatchid")]
        public int DispatchId { get; set; }

        [Required]
        [Column("vendor_id")]
        public int VendorId { get; set; }

        [Column("vehicle_id")]
        public int? VehicleId { get; set; }

        [Column("slip_number")]
        [StringLength(100)]
        public string? SlipNumber { get; set; }

        [Column("slip_image_url")]
        [StringLength(500)]
        public string? SlipImageUrl { get; set; }

        [Column("weight_gross", TypeName = "numeric(18,3)")]
        public decimal? WeightGross { get; set; }

        [Column("weight_tare", TypeName = "numeric(18,3)")]
        public decimal? WeightTare { get; set; }

        [Column("weight_net", TypeName = "numeric(18,3)")]
        public decimal? WeightNet { get; set; }

        [Column("material_type_id")]
        public int? MaterialTypeId { get; set; }

        [Column("material_rate", TypeName = "numeric(18,4)")]
        public decimal? MaterialRate { get; set; }

        [Column("amount_gross", TypeName = "numeric(18,2)")]
        public decimal? AmountGross { get; set; }

        [Column("penalty_amount", TypeName = "numeric(18,2)")]
        public decimal PenaltyAmount { get; set; } = 0;

        [Column("other_deduction", TypeName = "numeric(18,2)")]
        public decimal OtherDeduction { get; set; } = 0;

        [Column("advances_applied", TypeName = "numeric(18,2)")]
        public decimal AdvancesApplied { get; set; } = 0;

        [Column("amount_payable", TypeName = "numeric(18,2)")]
        public decimal? AmountPayable { get; set; }

        [Column("remarks")]
        [StringLength(500)]
        public string? Remarks { get; set; }

        [Required]
        [Column("status")]
        [StringLength(20)]
        public string Status { get; set; } = "Draft";

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("posted_at")]
        public DateTime? PostedAt { get; set; }

        [Column("files_url")]
        [StringLength(500)]
        public string? FilesUrl { get; set; }

        // Navigation properties
        public virtual Dispatch Dispatch { get; set; } = null!;
        public virtual Vendor.Vendor Vendor { get; set; } = null!;
        public virtual Vehicle.Vehicle? Vehicle { get; set; }
    }
}
