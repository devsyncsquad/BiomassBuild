using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class VUserMenu
    {
        [Key]
        public int EmpId { get; set; }
        public int RoleId { get; set; }
        public string? Icon { get; set; }
        public int MainMenuId { get; set; }
        public string? MainMenuDesc { get; set; }
        public int SubMenuRoleId { get; set; }
        public string? Username { get; set; }
        public string? RoleName { get; set; }
        public bool IsActive { get; set; }
        public string? Enabled { get; set; }
        public string? SubMenuEnabled { get; set; }
        public string? SubMenuDesc { get; set; }
        public int? SubMenuId { get; set; }
        public string? Link { get; set; }
        public int? OrderNo { get; set; }
    }
}
