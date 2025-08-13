namespace Biomass.Server.Models.UserManagement
{
    public class MainMenus
    {
        public int? MainMenuId { get; set; }
        public string? MainMenuDesc { get; set; }
        public int? OrderNo { get; set; }
        public string? Enabled { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? LastUpdatedBy { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
        public string? Icon { get; set; }
    }
}
