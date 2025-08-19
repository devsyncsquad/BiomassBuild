using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class UpdateUserRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [StringLength(255)]
        public string? PasswordHash { get; set; }

        [Required]
        public int EmpNo { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [Required]
        [StringLength(1)]
        public string IsTeamLead { get; set; } = "N";

        [Required]
        [StringLength(1)]
        public string Enabled { get; set; } = "Y";

        [StringLength(500)]
        public string? Comments { get; set; }

        public int? ReportingTo { get; set; }

        [Required]
        public int RoleId { get; set; }

        [Required]
        public int UpdatedBy { get; set; }

        public List<int> CustomerIds { get; set; } = new List<int>();
    }
}
