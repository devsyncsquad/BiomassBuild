using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class VUserRole
    {
        [Key]
        public int? UserRoleId { get; set; }
        public string? IsMainRole { get; set; }
        public int? RoleId { get; set; }
        public string? RoleName { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public string? PasswordHash { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
        public int? LastUpdatedBy { get; set; }
        public int? CompanyId { get; set; }
        public string? CanTamper { get; set; }
        public string? CanMask { get; set; }
        public string? CanEdit { get; set; }

    }

    public class VSubMenuRole
    {
        public int? SubMenuId { get; set; }
        public string? SubMenuDesc { get; set; }
        public string? Link { get; set; }
        public string? Icon { get; set; }
        public int? MainMenuId { get; set; }
        public int? OrderNo { get; set; }
        public string? Enabled { get; set; }
        public int? LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? MainMenuDesc { get; set; }
        public int? AppId { get; set; }
    }
}
