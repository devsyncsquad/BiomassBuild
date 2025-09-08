using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Lookup
{
    public class Lookup
    {
        [Key]
        [Column("lookup_id")]
        public int LookupId { get; set; }
        
        [Required]
        [MaxLength(100)]
        [Column("lookup_name")]
        public string LookupName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        [Column("lookup_domain")]
        public string LookupDomain { get; set; } = string.Empty;
        
        [Required]
        [Column("enabled")]
        public bool Enabled { get; set; } = true;
        
        [Required]
        [Column("sort_order")]
        public int SortOrder { get; set; } = 0;
        
        [Required]
        [Column("created_on")]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        
        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Column("show_in_dispatch")]
        public string? ShowInDispatch { get; set; } = string.Empty;
    }

    public class LookupDto
    {
        public int LookupId { get; set; }
        public string LookupName { get; set; } = string.Empty;
        public string LookupDomain { get; set; } = string.Empty;
        public bool Enabled { get; set; }
        public int SortOrder { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class CreateLookupRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string LookupName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LookupDomain { get; set; } = string.Empty;
        
        [Required]
        public bool Enabled { get; set; } = true;
        
        [Range(0, int.MaxValue)]
        public int SortOrder { get; set; } = 0;
    }

    public class UpdateLookupRequest
    {
        public int LookupId { get; set; }
        
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string LookupName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LookupDomain { get; set; } = string.Empty;
        
        [Required]
        public bool Enabled { get; set; }
        
        [Range(0, int.MaxValue)]
        public int SortOrder { get; set; }
    }

    public class LookupStatistics
    {
        public int Total { get; set; }
        public int Enabled { get; set; }
        public int Disabled { get; set; }
        public int Pending { get; set; }
    }
}


