using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.UserManagement
{
    public class VUserCompany
    {

        [Key]
        public int CId { get; set; }
        public int? VehiclesTotal { get; set; }
        public int? CompanyId { get; set; }
        public string? CreateTime { get; set; }
        public int? Status { get; set; }
        public string? ParentName { get; set; }
        public string? Account { get; set; }
        public string? Name { get; set; }
        public string? AbbrName { get; set; }
        public int? ParentId { get; set; }
        public int? Industry { get; set; }
        public int? UserId { get; set; }
        public string? Enabled { get; set; }

    }
}
