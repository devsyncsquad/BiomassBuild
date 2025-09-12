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
        public string? EffectiveDate { get; set; }
        
        [Column("company_rate", TypeName = "decimal(10,2)")]
        public decimal CompanyRate { get; set; }
        
        [Column("transporter_rate", TypeName = "decimal(10,2)")]
        public decimal TransporterRate { get; set; }
        
        [Column("diesel_rate", TypeName = "decimal(18,2)")]
        public decimal? DieselRate { get; set; }
        
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

        [Column("material_id")]
        [StringLength(100)]
        public int? MaterialId { get; set; }


        // Navigation properties - but don't create foreign key constraints if they don't exist
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
        public string? EffectiveDate { get; set; }
        public decimal CompanyRate { get; set; }
        public decimal TransporterRate { get; set; }
        public decimal? DieselRate { get; set; }
        public string? Route { get; set; }
        public string? MaterialType { get; set; }
        public string Status { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string LocationName { get; set; } = string.Empty;
        public string LocationCode { get; set; } = string.Empty;

        public int MaterialId { get; set; }
    }

    public abstract class MaterialRateRequestBase
    {
        [Required]
        public decimal CompanyRate { get; set; }
        
        [Required]
        public decimal TransporterRate { get; set; }

        public decimal? DieselRate { get; set; }
        
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
        public string? EffectiveDate { get; set; }

        public int? MaterialId { get; set; }
    }

    public class UpdateMaterialRateRequest : MaterialRateRequestBase
    {
        public string Status { get; set; } = string.Empty;
    }
}