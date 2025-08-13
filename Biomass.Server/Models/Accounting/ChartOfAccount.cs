using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Accounting
{
    [Table("ChartOfAccounts")] 
    public class ChartOfAccount
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("parent_id")]
        public int? ParentId { get; set; }

        [Column("level")]
        public int Level { get; set; } // 1=Main, 2=Sub, 3=Child

        [Required]
        [MaxLength(4)]
        [Column("code")]
        public string Code { get; set; } = string.Empty; // LPAD 2/3/4

        [Required]
        [MaxLength(200)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("type")]
        public string Type { get; set; } = string.Empty; // Asset/Liability/Equity/Revenue/Expense

        [MaxLength(500)]
        [Column("description")]
        public string? Description { get; set; }

        [MaxLength(1)]
        [Column("enabled")]
        public string? Enabled { get; set; } = "Y";

        [MaxLength(100)]
        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("created_on")]
        public DateTime CreatedOn { get; set; }

        [MaxLength(100)]
        [Column("modified_by")]
        public string? ModifiedBy { get; set; }

        [Column("modified_on")]
        public DateTime? ModifiedOn { get; set; }

        [ForeignKey(nameof(ParentId))]
        public ChartOfAccount? Parent { get; set; }
    }
}


