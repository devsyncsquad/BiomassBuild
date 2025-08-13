using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class VUser
    {
        [Key]
        public int? UserRoleId { get; set; }
        public string? IsMainRole { get; set; } // Nullable if IsMainRole can be null
        public int? RoleId { get; set; }
        public string? RoleName { get; set; }
        public string? Enabled { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? PasswordHash { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? EmpId { get; set; }
        public string? Email { get; set; }
        public string? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? LastUpdatedOn { get; set; } // Nullable if LastUpdatedOn can be null
        public int? LastUpdatedBy { get; set; } // Nullable if LastUpdatedBy can be null
        public string? DefaultUrl { get; set; }

        public string? CanTamper { get; set; }
        public string? CanMask { get; set; }
        public string? CanEdit { get; set; }
    }
}

