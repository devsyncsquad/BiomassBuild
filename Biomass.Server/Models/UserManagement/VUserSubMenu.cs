using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class VUserSubMenu
    {
        [Key]
        public int? SubMenuId { get; set; }
        public string? SubMenuDesc { get; set; }
        public string? Icon { get; set; }
        public string? Link { get; set; }
        public int? MainMenuId { get; set; }
        public int? OrderNo { get; set; }
        public string? Enabled { get; set; }

        public int? UserId { get; set; }
        public int? EmpId { get; set; }
        public string? IsActive { get; set; }
        public int? CompanyId { get; set; }
        public string? RoleName { get; set; }
        public string? CompanyName { get; set; }


    }
}
