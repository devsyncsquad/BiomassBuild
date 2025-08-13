using System.ComponentModel.DataAnnotations;


namespace Biomass.Server.Models.UserManagement
{
    public class VUserMainMenu
    {
        public int UserId { get; set; }
        public string? MainIcon { get; set; }
        [Key]
        public int? MainMenuId { get; set; }
        public int? MainMenuOrderNo { get; set; }
        public string? MainMenuDesc { get; set; }
        public string? DefaultUrl { get; set; }
        public string? MainMenuUrl { get; set; }

        public List<VUserSubMenu> SubMenus { get; set; } = new List<VUserSubMenu>();

    }
}
