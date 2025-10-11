using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Biomass.Server.Models.UserManagement;

namespace Biomass.Server.Models.CostCenter
{
    [Table("user_cost_centers")]
    public class UserCostCenter
    {
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("cost_center_id")]
        public int CostCenterId { get; set; }

        [Column("can_post")]
        public bool CanPost { get; set; }

        // Navigation properties
        public Users? User { get; set; }
        public CostCenter? CostCenter { get; set; }
    }
}
