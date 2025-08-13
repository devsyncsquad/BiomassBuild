using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class MenuRoles
    {
        [Key]
        public int MenuRoleId { get; set; }
        public int RoleId { get; set; }
        public int MenuId { get; set; }
    }
} 