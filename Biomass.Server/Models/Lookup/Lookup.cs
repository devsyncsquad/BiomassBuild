using System;
using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.Lookup
{
    public class Lookup
    {
        [Key]
        public int LookUpId { get; set; }
        [Required]
        [MaxLength(100)]
        public string LookUpName { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? LookUpDomain { get; set; }
        [MaxLength(1)]
        public bool? Enabled { get; set; }
        
        public string? CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}


