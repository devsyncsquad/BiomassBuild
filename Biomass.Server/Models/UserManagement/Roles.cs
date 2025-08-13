using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class Roles
    {
        [Key]
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
        public string? Enabled { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Description { get; set; }
    }
}
