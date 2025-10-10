using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.UserManagement
{
    [Table("user_cost_centers")]
    public class UserCostCenter
    {
        // bigint -> long
        [Column("user_id")]
        public int UserId { get; set; }

        // bigint -> long
        [Column("cost_center_id")]
        public int CostCenterId { get; set; }

        [Column("can_post")]
        public bool? CanPost { get; set; }

        // Navigations
        public Users? User { get; set; }
        public CostCenter.CostCenter? CostCenter { get; set; }
    }
}
