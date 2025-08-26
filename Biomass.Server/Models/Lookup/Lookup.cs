using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Lookup
{
    public class Lookup
    {
        [Key]
        [Column("lookup_id")]
        public int LookUpId { get; set; }
        [Required]
        [MaxLength(100)]
        [Column("lookup_name")]
        public string LookUpName { get; set; } = string.Empty;
        [MaxLength(100)]
        [Column("lookup_domain")]
        public string? LookUpDomain { get; set; }
        [MaxLength(1)]
        [Column("enabled")]
        public bool? Enabled { get; set; }
        [Column("created_by")]
        public int? CreatedBy { get; set; }
        [Column("created_on")]
        public DateTime CreatedOn { get; set; }
    }
}


