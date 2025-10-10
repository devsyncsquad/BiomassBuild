using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.CostCenter
{
    [Table("v_user_cost_centers")]
    public class VUserCostCenter
    {
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("username")]
        public string? Username { get; set; }

        [Column("cost_center_id")]
        public int CostCenterId { get; set; }

        [Column("cost_center_name")]
        public string? CostCenterName { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }

        [Column("parent_cost_center_id")]
        public int? ParentCostCenterId { get; set; }

        [Column("parent_cost_center_name")]
        public string? ParentCostCenterName { get; set; }

        [Column("can_post")]
        public bool CanPost { get; set; }
    }
}
