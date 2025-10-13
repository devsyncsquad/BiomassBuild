using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Dispatch
{
    /// <summary>
    /// DTO for v_dispatch_receipts view - includes denormalized data
    /// </summary>
    [Table("v_dispatch_receipts")]
    public class VDispatchReceiptDto
    {
        [Column("receipt_id")]
        public long? ReceiptId { get; set; }

        [Column("dispatchid")]
        public int? DispatchId { get; set; }

        [Column("vendor_name")]
        public string? VendorName { get; set; }

        [Column("vehicle_number")]
        public string? VehicleNumber { get; set; }

        [Column("slip_number")]
        public string? SlipNumber { get; set; }

        [Column("slip_image_url")]
        public string? SlipImageUrl { get; set; }

        [Column("weight_gross")]
        public decimal? WeightGross { get; set; }

        [Column("weight_tare")]
        public decimal? WeightTare { get; set; }

        [Column("weight_net")]
        public decimal? WeightNet { get; set; }

        [Column("material_type_id")]
        public int? MaterialTypeId { get; set; }

        [Column("material_rate")]
        public decimal? MaterialRate { get; set; }

        [Column("amount_gross")]
        public decimal? AmountGross { get; set; }

        [Column("penalty_amount")]
        public decimal? PenaltyAmount { get; set; }

        [Column("other_deduction")]
        public decimal? OtherDeduction { get; set; }

        [Column("advances_applied")]
        public decimal? AdvancesApplied { get; set; }

        [Column("amount_payable")]
        public decimal? AmountPayable { get; set; }

        [Column("remarks")]
        public string? Remarks { get; set; }

        [Column("status")]
        public string? Status { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("posted_at")]
        public DateTime? PostedAt { get; set; }

        [Column("files_url")]
        public string? FilesUrl { get; set; }

        [Column("bilty_received")]
        public bool? BiltyReceived { get; set; }

        [Column("vendor_id")]
        public int? VendorId { get; set; }

        [Column("vehicle_id")]
        public int? VehicleId { get; set; }

        [Column("cost_center_sub_id")]
        public int? CostCenterSubId { get; set; }

        [Column("cost_center_id")]
        public int? CostCenterId { get; set; }
    }
}

