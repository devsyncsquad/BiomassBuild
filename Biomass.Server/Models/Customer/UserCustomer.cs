using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Biomass.Server.Models.UserManagement;

namespace Biomass.Server.Models.Customer
{
    [Table("user_customers")]
    public class UserCustomer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("uc_id")]
        public int UcId { get; set; }
        
        [Column("user_id")]
        public int UserId { get; set; }
        
        [Column("customer_id")]
        public int CustomerId { get; set; }
        
        [Column("enabled")]
        public bool Enabled { get; set; } = true;
        
        [Column("createdon")]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        
        [Column("createdby")]
        public int? CreatedBy { get; set; }
        
        // Navigation properties
        public virtual Users User { get; set; }
        public virtual Customer Customer { get; set; }
    }
}
