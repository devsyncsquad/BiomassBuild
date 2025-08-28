using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Vehicle
{
    [Table("vehicles")]
    public class Vehicle
    {
        [Key]
        [Column("vehicleid")]
        public int VehicleId { get; set; }

        [Required]
        [StringLength(50)]
        [Column("vehiclenumber")]
        public string VehicleNumber { get; set; }

        [Required]
        [StringLength(50)]
        [Column("vehicletype")]
        public string VehicleType { get; set; }

        [Column("capacity")]
        public decimal? Capacity { get; set; }

        [Required]
        [StringLength(50)]
        [Column("fueltype")]
        public string FuelType { get; set; }

        [StringLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Active";

        [Column("createdon")]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        [Column("vehicle_reg_number")]
        public string? VehicleRegNumber { get; set; }

        [Column("vendorid")]
        public int? VendorId { get; set; }

        // Navigation property for Driver
        public virtual Driver.Driver? Driver { get; set; }
    }
}