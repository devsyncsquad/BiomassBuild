using Biomass.Server.Models.Customer;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Dispatch
{
    [Table("dispatches")]
    public class Dispatch
    {
        [Key]
        [Column("dispatchid")]
        public int DispatchId { get; set; }

        [Required]
        [Column("vehicleid")]
        public int VehicleId { get; set; }

        [Required]
        [Column("locationid")]
        public int LocationId { get; set; }

        [StringLength(100)]
        [Column("materialtype")]
        public string? MaterialType { get; set; }

        [Column("materialrate")]
        public decimal? MaterialRate { get; set; }

        [StringLength(50)]
        [Column("slipnumber")]
        public string? SlipNumber { get; set; }

        [StringLength(255)]
        [Column("slippicture")]
        public string? SlipPicture { get; set; }

        [Column("firstweight")]
        public decimal? FirstWeight { get; set; }

        [Column("secondweight")]
        public decimal? SecondWeight { get; set; }

        [Column("netweight")]
        public decimal? NetWeight { get; set; }

        [Column("loadercharges")]
        public decimal? LoaderCharges { get; set; }

        [Column("loaderchargesauto")]
        public bool LoaderChargesAuto { get; set; } = false;

        [StringLength(20)]
        [Column("loaderchargestype")]
        public string? LoaderChargesType { get; set; }

        [Column("laborcharges")]
        public decimal? LaborCharges { get; set; }

        [Column("laborchargesauto")]
        public bool LaborChargesAuto { get; set; } = false;

        [StringLength(20)]
        [Column("laborchargestype")]
        public string? LaborChargesType { get; set; }

        [Column("transporterrate")]
        public decimal? TransporterRate { get; set; }

        [Column("transporterrateauto")]
        public bool TransporterRateAuto { get; set; } = false;

        [StringLength(20)]
        [Column("transporterchargestype")]
        public string? TransporterChargesType { get; set; }

        [Column("amount")]
        public decimal? Amount { get; set; }

        [Column("totaldeduction")]
        public decimal? TotalDeduction { get; set; }

        [Column("createdby")]
        public int? CreatedBy { get; set; }

        [Column("createdon")]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        [StringLength(20)]
        [Column("status")]
        public string? Status { get; set; }

        [Column("payable_weight")]
        public int? PayableWeight { get; set; }

        // Navigation properties
        public virtual Vehicle.Vehicle? Vehicle { get; set; }
        public virtual CustomerLocation? Location { get; set; }
    }
}
