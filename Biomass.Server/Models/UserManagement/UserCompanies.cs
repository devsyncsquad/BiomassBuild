using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class UserCompanies
    {
        [Key]
        public int? UserCompanyId { get; set; }
        public int? UserID { get; set; }
        public string? Enabled { get; set; }
        public int? CompanyID { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
