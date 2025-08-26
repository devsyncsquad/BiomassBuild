using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.Driver
{
    public class DriverDto
    {
        public int DriverId { get; set; }
        public string FullName { get; set; }
        public string? CNIC { get; set; }
        public string LicenseNumber { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string Status { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class CreateDriverRequest
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(20)]
        public string? CNIC { get; set; }

        [Required]
        [StringLength(50)]
        public string LicenseNumber { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active";
    }

    public class UpdateDriverRequest : CreateDriverRequest
    {
        public int DriverId { get; set; }
    }
}