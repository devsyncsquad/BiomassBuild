using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class SubMenus
    {
        [Key]
        public int? SubMenuId { get; set; }
        public string? SubMenuDesc { get; set; }
        public string? Link { get; set; }
        public string? Icon { get; set; }
        public int? MainMenuId { get; set; }
        public int? OrderNo { get; set; }
        public string? Enabled { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
        public int? AppId { get; set; }

    }
}
