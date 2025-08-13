using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Customer
{
    [Table("locations")]
    public class CustomerLocation
    {
        [Key]
        [Column("locationid")]
        public int LocationId { get; set; }
        
        [Required]
        [Column("customerid")]
        public int CustomerId { get; set; }
        
        [Required]
        [StringLength(100)]
        [Column("locationname")]
        public string LocationName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        [Column("locationcode")]
        public string LocationCode { get; set; } = string.Empty;
        
        [StringLength(250)]
        [Column("address")]
        public string? Address { get; set; }
        
        [Column("centerdispatchweightlimit")]
        public decimal? CenterDispatchWeightLimit { get; set; }
        
        [Column("advancepercentageallowed")]
        public decimal? AdvancePercentageAllowed { get; set; }
        
        [Column("tolerancelimitpercentage")]
        public decimal? ToleranceLimitPercentage { get; set; }
        
        [Column("tolerancelimitkg")]
        public decimal? ToleranceLimitKg { get; set; }
        
        [Column("materialpenaltyrateperkg")]
        public decimal? MaterialPenaltyRatePerKg { get; set; }
        
        // Dispatch Loading Charges
        [Column("dispatchloadingchargesenabled")]
        public bool DispatchLoadingChargesEnabled { get; set; } = false;
        
        [StringLength(50)]
        [Column("dispatchchargetype")]
        public string? DispatchChargeType { get; set; } // "Fixed" or "Variable"
        
        [Column("fixedloadercost")]
        public decimal? FixedLoaderCost { get; set; }
        
        [StringLength(50)]
        [Column("variablechargetype")]
        public string? VariableChargeType { get; set; } // "LoaderPerMaan" or "LaborPerMonth"
        
        [Column("variablechargeamount")]
        public decimal? VariableChargeAmount { get; set; }
        
        // Receiving Unloading Cost
        [Column("receivingunloadingcostenabled")]
        public bool ReceivingUnloadingCostEnabled { get; set; } = false;
        
        [StringLength(50)]
        [Column("receivingchargetype")]
        public string? ReceivingChargeType { get; set; } // "Fixed" or "Variable"
        
        [Column("fixedunloadingcost")]
        public decimal? FixedUnloadingCost { get; set; }
        
        [StringLength(50)]
        [Column("receivingvariablechargetype")]
        public string? ReceivingVariableChargeType { get; set; } // "UnloadingPerMaan" or "LaborPerMonth"
        
        [Column("receivingvariablechargeamount")]
        public decimal? ReceivingVariableChargeAmount { get; set; }
        
        [StringLength(20)]
        [Column("status")]
        public string Status { get; set; } = "active";
        
        [Column("createdby")]
        public int CreatedBy { get; set; }
        
        [Column("createdon")]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        
        [Column("lastupdatedon")]
        public DateTime? LastUpdatedOn { get; set; }
        
        [Column("lastupdatedby")]
        public int? LastUpdatedBy { get; set; }
        
        // GPS Coordinates for map integration
        [Column("latitude")]
        public decimal? Latitude { get; set; }
        
        [Column("longitude")]
        public decimal? Longitude { get; set; }
        
        // Navigation property
        public virtual Customer Customer { get; set; } = null!;
        public virtual ICollection<MaterialRate> MaterialRates { get; set; } = new List<MaterialRate>();
    }

    public class CustomerLocationDto
    {
        public int LocationId { get; set; }
        public int CustomerId { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string LocationCode { get; set; } = string.Empty;
        public string? Address { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? CenterDispatchWeightLimit { get; set; }
        public decimal? AdvancePercentageAllowed { get; set; }
        public decimal? ToleranceLimitPercentage { get; set; }
        public decimal? ToleranceLimitKg { get; set; }
        public decimal? MaterialPenaltyRatePerKg { get; set; }
        public bool DispatchLoadingChargesEnabled { get; set; }
        public string? DispatchChargeType { get; set; }
        public decimal? FixedLoaderCost { get; set; }
        public string? VariableChargeType { get; set; }
        public decimal? VariableChargeAmount { get; set; }
        public bool ReceivingUnloadingCostEnabled { get; set; }
        public string? ReceivingChargeType { get; set; }
        public decimal? FixedUnloadingCost { get; set; }
        public string? ReceivingVariableChargeType { get; set; }
        public decimal? ReceivingVariableChargeAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
        public string CustomerName { get; set; } = string.Empty;
    }

    public class CreateCustomerLocationRequest
    {
        [Required]
        public int CustomerId { get; set; }
        
        [Required]
        public string LocationName { get; set; } = string.Empty;
        
        [Required]
        public string LocationCode { get; set; } = string.Empty;
        
        public string? Address { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? CenterDispatchWeightLimit { get; set; }
        public decimal? AdvancePercentageAllowed { get; set; }
        public decimal? ToleranceLimitPercentage { get; set; }
        public decimal? ToleranceLimitKg { get; set; }
        public decimal? MaterialPenaltyRatePerKg { get; set; }
        public bool DispatchLoadingChargesEnabled { get; set; }
        public string? DispatchChargeType { get; set; }
        public decimal? FixedLoaderCost { get; set; }
        public string? VariableChargeType { get; set; }
        public decimal? VariableChargeAmount { get; set; }
        public bool ReceivingUnloadingCostEnabled { get; set; }
        public string? ReceivingChargeType { get; set; }
        public decimal? FixedUnloadingCost { get; set; }
        public string? ReceivingVariableChargeType { get; set; }
        public decimal? ReceivingVariableChargeAmount { get; set; }
    }

    public class UpdateCustomerLocationRequest
    {
        [Required]
        public string LocationName { get; set; } = string.Empty;
        
        [Required]
        public string LocationCode { get; set; } = string.Empty;
        
        public string? Address { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? CenterDispatchWeightLimit { get; set; }
        public decimal? AdvancePercentageAllowed { get; set; }
        public decimal? ToleranceLimitPercentage { get; set; }
        public decimal? ToleranceLimitKg { get; set; }
        public decimal? MaterialPenaltyRatePerKg { get; set; }
        public bool DispatchLoadingChargesEnabled { get; set; }
        public string? DispatchChargeType { get; set; }
        public decimal? FixedLoaderCost { get; set; }
        public string? VariableChargeType { get; set; }
        public decimal? VariableChargeAmount { get; set; }
        public bool ReceivingUnloadingCostEnabled { get; set; }
        public string? ReceivingChargeType { get; set; }
        public decimal? FixedUnloadingCost { get; set; }
        public string? ReceivingVariableChargeType { get; set; }
        public decimal? ReceivingVariableChargeAmount { get; set; }
        public string Status { get; set; } = string.Empty;
    }
} 