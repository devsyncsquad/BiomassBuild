using Biomass.Server.Models.UserManagement;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? PasswordHash { get; set; }
        public required string FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedOn { get; set; }

        // Navigation properties
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<UserCompanies> UserCompanies { get; set; } = new List<UserCompanies>();
    }


    public class UserModel
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? PasswordHash { get; set; }
        public required string FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
        public int[]? UserCompaniesList { get; set; }
        //public List<UserCompanies> UserCompaniesList { get; set; }

    }
} 