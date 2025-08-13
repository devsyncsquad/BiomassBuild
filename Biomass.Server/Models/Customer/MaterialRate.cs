using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Customer
{
    [Table("material_rates")]
    public class MaterialRate
    {
        [Key]
        [Column("rateid")]
        public int RateId { get; set; }
        
        [Column("customerid")]
        public int CustomerId { get; set; }

        [Column("location_id")]
        public int LocationId { get; set; }
        
        [Column("effectivedate")]
        public DateTime EffectiveDate { get; set; }
        
        [Column("company_rate", TypeName = "decimal(10,2)")]
        public decimal CompanyRate { get; set; }
        
        [Column("transporter_rate", TypeName = "decimal(10,2)")]
        public decimal TransporterRate { get; set; }

        [Column("dispatchweight", TypeName = "decimal(10,2)")]
        public decimal DispatchWeight { get; set; }

        [Column("receivingweight", TypeName = "decimal(10,2)")]
        public decimal ReceivingWeight { get; set; }
        
        [Column("route")]
        [StringLength(100)]
        public string? Route { get; set; }
        
        [Column("materialtype")]
        [StringLength(100)]
        public string? MaterialType { get; set; }
        
        [Column("status")]
        [StringLength(20)]
        public string Status { get; set; } = "active";
        
        [Column("createdby")]
        public int CreatedBy { get; set; }
        
        [Column("createdon")]
        public DateTime CreatedOn { get; set; }

        // Navigation properties
        [ForeignKey(nameof(CustomerId))]
        public virtual Customer Customer { get; set; } = null!;

        [ForeignKey(nameof(LocationId))]
        public virtual CustomerLocation CustomerLocation { get; set; } = null!;
    }

    public class MaterialRateDto
    {
        public int RateId { get; set; }
        public int CustomerId { get; set; }
        public int LocationId { get; set; }
        public DateTime EffectiveDate { get; set; }
        public decimal CompanyRate { get; set; }
        public decimal TransporterRate { get; set; }
        public decimal DispatchWeight { get; set; }
        public decimal ReceivingWeight { get; set; }
        public string? Route { get; set; }
        public string? MaterialType { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string LocationName { get; set; } = string.Empty;
        public string LocationCode { get; set; } = string.Empty;
    }

    public abstract class MaterialRateRequestBase
    {
        [Required]
        public decimal CompanyRate { get; set; }
        
        [Required]
        public decimal TransporterRate { get; set; }

        [Required]
        public decimal DispatchWeight { get; set; }

        [Required]
        public decimal ReceivingWeight { get; set; }
        
        public string? Route { get; set; }
        public string? MaterialType { get; set; }
    }

    public class CreateMaterialRateRequest : MaterialRateRequestBase
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int LocationId { get; set; }
        
        [Required]
        public DateTime EffectiveDate { get; set; }
    }

    public class UpdateMaterialRateRequest : MaterialRateRequestBase
    {
        public string Status { get; set; } = string.Empty;
    }
}