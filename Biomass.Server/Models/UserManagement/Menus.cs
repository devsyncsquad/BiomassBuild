using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class Menus
    {
        [Key]
        public int MenuId { get; set; }
        public string? MenuName { get; set; }
        public string? IconUrl { get; set; }
        public int? OrderNo { get; set; }
        public string? IsEnabled { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Link { get; set; }
    }
} 