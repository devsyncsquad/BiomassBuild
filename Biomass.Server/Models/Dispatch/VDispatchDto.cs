using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Dispatch
{
    /// <summary>
    /// DTO representing the v_dispatch database view
    /// This view joins dispatches, vehicles, and v_locations tables
    /// </summary>
    public class VDispatchDto
    {
        // Vehicle fields
        [Column("vehiclenumber")]
        public string? VehicleNumber { get; set; }
        
        [Column("cost_center_id")]
        public int? CostCenterId { get; set; }
        
        // Location fields
        [Column("firstname")]
        public string? FirstName { get; set; }
        
        [Column("locationname")]
        public string? LocationName { get; set; }
        
        // Dispatch fields
        [Column("dispatchid")]
        public int DispatchId { get; set; }
        
        [Column("vehicleid")]
        public int VehicleId { get; set; }
        
        [Column("locationid")]
        public int LocationId { get; set; }
        
        [Column("materialtype")]
        public string? MaterialType { get; set; }
        
        [Column("materialrate")]
        public decimal? MaterialRate { get; set; }
        
        [Column("slipnumber")]
        public string? SlipNumber { get; set; }
        
        [Column("slippicture")]
        public string? SlipPicture { get; set; }
        
        [Column("firstweight")]
        public decimal? FirstWeight { get; set; }
        
        [Column("secondweight")]
        public decimal? SecondWeight { get; set; }
        
        [Column("netweight")]
        public decimal? NetWeight { get; set; }
        
        [Column("loadercharges")]
        public decimal? LoaderCharges { get; set; }
        
        [Column("loaderchargesauto")]
        public bool LoaderChargesAuto { get; set; }
        
        [Column("loaderchargestype")]
        public string? LoaderChargesType { get; set; }
        
        [Column("laborcharges")]
        public decimal? LaborCharges { get; set; }
        
        [Column("laborchargesauto")]
        public bool LaborChargesAuto { get; set; }
        
        [Column("laborchargestype")]
        public string? LaborChargesType { get; set; }
        
        [Column("transporterrate")]
        public decimal? TransporterRate { get; set; }
        
        [Column("transporterrateauto")]
        public bool TransporterRateAuto { get; set; }
        
        [Column("transporterchargestype")]
        public string? TransporterChargesType { get; set; }
        
        [Column("amount")]
        public decimal? Amount { get; set; }
        
        [Column("dispatchdeduction")]
        public decimal? DispatchDeduction { get; set; }
        
        [Column("createdby")]
        public int? CreatedBy { get; set; }
        
        [Column("createdon")]
        public DateTime CreatedOn { get; set; }
        
        [Column("status")]
        public string? Status { get; set; }
        
        [Column("payable_weight")]
        public int? PayableWeight { get; set; }
        
        [Column("payable_weight_mund")]
        public decimal? PayableWeightMund { get; set; }
        
        [Column("bucket_vendor_id")]
        public int? BucketVendorId { get; set; }
        
        [Column("labour_vendor_id")]
        public int? LabourVendorId { get; set; }
        
        // Additional location fields from v_locations
        [Column("tolerance_limit_kg")]
        public decimal? ToleranceLimitKg { get; set; }
        
        [Column("tolerance_limit_percentage")]
        public decimal? ToleranceLimitPercentage { get; set; }
        
        [Column("advance_percentage_allowed")]
        public decimal? AdvancePercentageAllowed { get; set; }
        
        [Column("center_dispatch_weight_limit")]
        public decimal? CenterDispatchWeightLimit { get; set; }
        
        [Column("material_penalty_rateperkg")]
        public decimal? MaterialPenaltyRatePerKg { get; set; }


        [Column("transporter_vendor_id")]
        public int? TransporterVendorId { get; set; }

        [Column("material_id")]
        public int? MaterialId { get; set; }

        [Column("totaldeduction")]
        public decimal? TotalDeduction { get; set; }

        [Column("intransitexpenses")]
        public decimal? InTransitExpenses { get; set; }




    }
}
