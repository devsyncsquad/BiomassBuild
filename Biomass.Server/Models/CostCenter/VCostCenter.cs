using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Models.CostCenter
{
    [Keyless]
    public class VCostCenter
    {
        public int? CostCenterId { get; set; }          // 1, 2, 7
        public string? Code { get; set; }               // "OPS", "MKT", "FUEL"
        public string? Name { get; set; }               // "Operations", "Marketing", "Fuel"
        public bool? IsActive { get; set; }             // true
        public int? ParentCostCenterId { get; set; }   // null, null, 1
        public DateTime? CreatedAt { get; set; }       // null, null, 2025-08-16
        public bool? IsChild { get; set; }              // false, false, true
        public string? ParentName { get; set; }
    }
}
