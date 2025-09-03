using System.ComponentModel.DataAnnotations;
using Biomass.Server.Models.Vehicle;
using Biomass.Server.Models.Customer;

namespace Biomass.Server.Models.Dispatch
{
    public class DispatchDto
    {
        public int DispatchId { get; set; }
        public int VehicleId { get; set; }
        public int LocationId { get; set; }
        public string? MaterialType { get; set; }
        public decimal? MaterialRate { get; set; }
        public string? SlipNumber { get; set; }
        public string? SlipPicture { get; set; }
        public decimal? FirstWeight { get; set; }
        public decimal? SecondWeight { get; set; }
        public decimal? NetWeight { get; set; }
        public decimal? LoaderCharges { get; set; }
        public bool LoaderChargesAuto { get; set; }
        public string? LoaderChargesType { get; set; }
        public decimal? LaborCharges { get; set; }
        public bool LaborChargesAuto { get; set; }
        public string? LaborChargesType { get; set; }
        public decimal? TransporterRate { get; set; }
        public bool TransporterRateAuto { get; set; }
        public string? TransporterChargesType { get; set; }
        public decimal? Amount { get; set; }
        public decimal? TotalDeduction { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? Status { get; set; }
        public int? PayableWeight { get; set; }
        
        // Navigation properties
        public VehicleDto? Vehicle { get; set; }
        public CustomerLocation? Location { get; set; }
    }

    public class CreateDispatchRequest
    {
        [Required]
        public int VehicleId { get; set; }

        [Required]
        public int LocationId { get; set; }

        [StringLength(100)]
        public string? MaterialType { get; set; }

        public decimal? MaterialRate { get; set; }

        [StringLength(50)]
        public string? SlipNumber { get; set; }

        [StringLength(255)]
        public string? SlipPicture { get; set; }

        public decimal? FirstWeight { get; set; }

        public decimal? SecondWeight { get; set; }

        public decimal? NetWeight { get; set; }

        public decimal? LoaderCharges { get; set; }

        public bool LoaderChargesAuto { get; set; } = false;

        [StringLength(20)]
        public string? LoaderChargesType { get; set; }

        public decimal? LaborCharges { get; set; }

        public bool LaborChargesAuto { get; set; } = false;

        [StringLength(20)]
        public string? LaborChargesType { get; set; }

        public decimal? TransporterRate { get; set; }

        public bool TransporterRateAuto { get; set; } = false;

        [StringLength(20)]
        public string? TransporterChargesType { get; set; }

        public decimal? Amount { get; set; }

        public decimal? TotalDeduction { get; set; }

        public int? CreatedBy { get; set; }

        [StringLength(20)]
        public string? Status { get; set; } = "Active";

        public int? PayableWeight { get; set; }
    }

    public class UpdateDispatchRequest
    {
        [Required]
        public int VehicleId { get; set; }

        [Required]
        public int LocationId { get; set; }

        [StringLength(100)]
        public string? MaterialType { get; set; }

        public decimal? MaterialRate { get; set; }

        [StringLength(50)]
        public string? SlipNumber { get; set; }

        [StringLength(255)]
        public string? SlipPicture { get; set; }

        public decimal? FirstWeight { get; set; }

        public decimal? SecondWeight { get; set; }

        public decimal? NetWeight { get; set; }

        public decimal? LoaderCharges { get; set; }

        public bool LoaderChargesAuto { get; set; }

        [StringLength(20)]
        public string? LoaderChargesType { get; set; }

        public decimal? LaborCharges { get; set; }

        public bool LaborChargesAuto { get; set; }

        [StringLength(20)]
        public string? LaborChargesType { get; set; }

        public decimal? TransporterRate { get; set; }

        public bool TransporterRateAuto { get; set; }

        [StringLength(20)]
        public string? TransporterChargesType { get; set; }

        public decimal? Amount { get; set; }

        public decimal? TotalDeduction { get; set; }

        [StringLength(20)]
        public string? Status { get; set; }

        public int? PayableWeight { get; set; }
    }
}
