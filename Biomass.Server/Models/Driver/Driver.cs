using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Driver
{
    [Table("drivers")]
    public class Driver
    {
        [Key]
        [Column("driverid")]
        public int DriverId { get; set; }

        [Required]
        [StringLength(100)]
        [Column("fullname")]
        public string FullName { get; set; }

        [StringLength(20)]
        [Column("cnic")]
        public string? CNIC { get; set; }

        [Required]
        [StringLength(50)]
        [Column("licensenumber")]
        public string LicenseNumber { get; set; }

        [StringLength(20)]
        [Column("phonenumber")]
        public string? PhoneNumber { get; set; }

        [StringLength(200)]
        [Column("address")]
        public string? Address { get; set; }

        [StringLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Active";

        [Column("createdon")]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        [Column("vehicleid")]
        public int? VehicleId { get; set; }

        // Navigation property for Vehicle
        [ForeignKey("VehicleId")]
        public virtual Vehicle.Vehicle? Vehicle { get; set; }
    }
}