using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.UserManagement
{
    public class Users
    {
        [Key]
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? PasswordHash { get; set; }
        public int? EmpNo { get; set; }
        public int? RoleId { get; set; }
        public string? PhoneNumber { get; set; }
        public string? IsTeamLead { get; set; }
        public string? Enabled { get; set; }
        public string? Comments { get; set; }
        public int? ReportingTo { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        [NotMapped]
        public List<int> CustomerIds { get; set; } = new List<int>();
    }
} 