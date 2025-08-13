using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class ApplicationConfig
    {
        [Key]
        public int? AppId { get; set; }
        public string? AppName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Enabled { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
    }
}
