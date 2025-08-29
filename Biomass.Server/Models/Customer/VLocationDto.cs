using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Customer
{
    [Table("v_locations")]
    public class VLocationDto
    {
        public string? firstname { get; set; }
        public string? lastname { get; set; }
        public string? customerstatus { get; set; }
        public int? locationid { get; set; }
        public int? customerid { get; set; }
        public string? locationname { get; set; }
        public string? locationcode { get; set; }
        public string? address { get; set; }
        public decimal? center_dispatch_weight_limit { get; set; }
        public decimal? advance_percentage_allowed { get; set; }
        public decimal? tolerance_limit_percentage { get; set; }
        public decimal? tolerance_limit_kg { get; set; }
        public decimal? material_penalty_rateperkg { get; set; }
        public bool? dispatch_loading_charges_enabled { get; set; }
        public string? dispatch_charge_type { get; set; }
        public decimal? fixed_loader_cost { get; set; }
        public string? variable_charge_type { get; set; }
        public decimal? variable_charge_amount { get; set; }
        public bool? receiving_unloading_cost_enabled { get; set; }
        public string? receiving_charge_type { get; set; }
        public decimal? fixed_unloading_cost { get; set; }
        public string? receiving_variable_charge_type { get; set; }
        public decimal? receiving_variable_charge_amount { get; set; }
        public string? status { get; set; }

        
        public int? createdby { get; set; }
        public DateTime? createdon { get; set; }
        public DateTime? lastupdatedon { get; set; }
        public int? lastupdatedby { get; set; }

        public decimal? latitude { get; set; }
        public decimal? longitude { get; set; }
        public bool? labor_charges_enabled { get; set; }
        public string? labor_charge_type { get; set; }
        public decimal? labor_charges_cost { get; set; }
    }
}