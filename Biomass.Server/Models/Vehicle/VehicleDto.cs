using Biomass.Server.Models.Driver;
using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.Vehicle
{
    public class VehicleDto
    {
        public int VehicleId { get; set; }
        public string? VehicleNumber { get; set; }
        public string? VehicleType { get; set; }
        public decimal? Capacity { get; set; }
        public string? FuelType { get; set; }
        public string? Status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? VehicleRegNumber { get; set; }
        public int? VendorId { get; set; }
        public int? CostCenterId { get; set; }
        public int? CostCenterSubId { get; set; }
        public string? IsWeightAllocated { get; set; }
        public int? WeightAllowed { get; set; }
        public Driver.DriverDto? Driver { get; set; }
    }

    public class CreateVehicleRequest
    {
        [Required]
        [StringLength(50)]
        public string VehicleNumber { get; set; }

        [StringLength(50)]
        public string VehicleType { get; set; }

        public decimal? Capacity { get; set; }

        [StringLength(50)]
        public string FuelType { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active";

        public string? VehicleRegNumber { get; set; }
        public int? VendorId { get; set; }
        public int? CostCenterId { get; set; }
        public string? IsWeightAllocated { get; set; }
        public int? WeightAllowed { get; set; }

        // Optional driver information
        public CreateDriverRequest? Driver { get; set; }
    }

    public class UpdateVehicleRequest
    {
        [Required]
        [StringLength(50)]
        public string VehicleNumber { get; set; }

        [StringLength(50)]
        public string VehicleType { get; set; }

        public decimal? Capacity { get; set; }

        [StringLength(50)]
        public string FuelType { get; set; }

        [StringLength(20)]
        public string Status { get; set; }

        public string? VehicleRegNumber { get; set; }
        public int? VendorId { get; set; }
        public int? CostCenterId { get; set; }
        public string? IsWeightAllocated { get; set; }
        public int? WeightAllowed { get; set; }

        // Optional driver information for update
        public UpdateDriverRequest? Driver { get; set; }
    }
}
