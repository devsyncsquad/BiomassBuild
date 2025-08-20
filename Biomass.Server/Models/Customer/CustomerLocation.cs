using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Customer
{
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

        [Column("center_dispatch_weight_limit")]
        public decimal? CenterDispatchWeightLimit { get; set; }

        [Column("advance_percentage_allowed")]
        public decimal? AdvancePercentageAllowed { get; set; }

        [Column("tolerance_limit_percentage")]
        public decimal? ToleranceLimitPercentage { get; set; }

        [Column("tolerance_limit_kg")]
        public decimal? ToleranceLimitKg { get; set; }

        [Column("material_penalty_rateperkg")]
        public decimal? MaterialPenaltyRatePerKg { get; set; }

        [Column("dispatch_loading_charges_enabled")]
        public bool DispatchLoadingChargesEnabled { get; set; } = false;

        [StringLength(50)]
        [Column("dispatch_charge_type")]
        public string? DispatchChargeType { get; set; } // "Fixed" or "Variable"

        [Column("fixed_loader_cost")]
        public decimal? FixedLoaderCost { get; set; }

        [StringLength(50)]
        [Column("variable_charge_type")]
        public string? VariableChargeType { get; set; } // "LoaderPerMaan" or "LaborPerMonth"

        [Column("variable_charge_amount")]
        public decimal? VariableChargeAmount { get; set; }

        [Column("receiving_unloading_cost_enabled")]
        public bool ReceivingUnloadingCostEnabled { get; set; } = false;

        [StringLength(50)]
        [Column("receiving_charge_type")]
        public string? ReceivingChargeType { get; set; } // "Fixed" or "Variable"

        [Column("fixed_unloading_cost")]
        public decimal? FixedUnloadingCost { get; set; }

        [StringLength(50)]
        [Column("receiving_variable_charge_type")]
        public string? ReceivingVariableChargeType { get; set; } // "UnloadingPerMaan" or "LaborPerMonth"

        [Column("receiving_variable_charge_amount")]
        public decimal? ReceivingVariableChargeAmount { get; set; }

        [Required]
        [StringLength(20)]
        [Column("status")]
        public string Status { get; set; } = "active";

        [Column("createdby")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("createdon")]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        [Column("lastupdatedon")]
        public DateTime? LastUpdatedOn { get; set; }

        [Column("lastupdatedby")]
        public int? LastUpdatedBy { get; set; }

        [Column("latitude")]
        public decimal? Latitude { get; set; }

        [Column("longitude")]
        public decimal? Longitude { get; set; }

        [Column("labor_charges_enabled")]
        public bool LaborChargesEnabled { get; set; } = false;

        [StringLength(50)]
        [Column("labor_charge_type")]
        public string? LaborChargeType { get; set; } // "Fixed" or "Variable"

        [Column("labor_charges_cost")]
        public decimal? LaborChargesCost { get; set; }

        // Navigation properties
        public virtual Customer Customer { get; set; } = null!;
    }

    public class CustomerLocationDto
    {
        public int LocationId { get; set; }
        public int CustomerId { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string LocationCode { get; set; } = string.Empty;
        public string? Address { get; set; }
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
        public bool LaborChargesEnabled { get; set; }
        public string? LaborChargeType { get; set; }
        public decimal? LaborChargesCost { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
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
        public bool LaborChargesEnabled { get; set; }
        public string? LaborChargeType { get; set; }
        public decimal? LaborChargesCost { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }

    public class UpdateCustomerLocationRequest
    {
        [Required]
        public string LocationName { get; set; } = string.Empty;

        [Required]
        public string LocationCode { get; set; } = string.Empty;

        public string? Address { get; set; }
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
        public bool LaborChargesEnabled { get; set; }
        public string? LaborChargeType { get; set; }
        public decimal? LaborChargesCost { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }

    public class LocationCostsDto
    {
        public int LocationId { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public string LocationCode { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        
        // Dispatch Loading Charges
        public bool DispatchLoadingChargesEnabled { get; set; }
        public string? DispatchChargeType { get; set; }
        public decimal? FixedLoaderCost { get; set; }
        public string? VariableChargeType { get; set; }
        public decimal? VariableChargeAmount { get; set; }
        
        // Labour Charges
        public bool LaborChargesEnabled { get; set; }
        public string? LaborChargeType { get; set; }
        public decimal? LaborChargesCost { get; set; }
        
        // Receiving Unloading Cost
        public bool ReceivingUnloadingCostEnabled { get; set; }
        public string? ReceivingChargeType { get; set; }
        public decimal? FixedUnloadingCost { get; set; }
        public string? ReceivingVariableChargeType { get; set; }
        public decimal? ReceivingVariableChargeAmount { get; set; }
        
        // Tolerance and Limits
        public decimal? ToleranceLimitPercentage { get; set; }
        public decimal? ToleranceLimitKg { get; set; }
        public decimal? CenterDispatchWeightLimit { get; set; }
        public decimal? MaterialPenaltyRatePerKg { get; set; }
    }
} 