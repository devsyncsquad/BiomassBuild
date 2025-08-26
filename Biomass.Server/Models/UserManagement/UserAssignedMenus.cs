using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class UserAssignedMenus
    {
        public int MenuId { get; set; }
        public string? MenuName { get; set; }
        public string? IconUrl { get; set; }
        public string? Link { get; set; }
        public int? OrderNo { get; set; }
        public string? IsEnabled { get; set; }
        public int RoleId { get; set; }
    }
}
