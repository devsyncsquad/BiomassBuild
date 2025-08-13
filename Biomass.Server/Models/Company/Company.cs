using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Company
{
    public class Company
    {
        [Key]
        public int CompanyId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string? CompanyName { get; set; }
        
        [StringLength(500)]
        public string? CompanyAddress { get; set; }
        
        [StringLength(50)]
        public string? NTN { get; set; } // National Tax Number
        
        [StringLength(50)]
        public string? STRN { get; set; } // Sales Tax Registration Number
        
        [StringLength(50)]
        public string? PRA { get; set; } // Pakistan Revenue Authority
        
        [StringLength(100)]
        public string? ContactPersonName { get; set; }
        
        [StringLength(20)]
        public string? ContactPersonPhone { get; set; }
        
        [StringLength(200)]
        public string? CompanyDescription { get; set; }
        
        [StringLength(100)]
        public string? Industry { get; set; }
        
        [StringLength(50)]
        public string? CompanySize { get; set; }
        
        [StringLength(100)]
        public string? Location { get; set; }
        
        [StringLength(500)]
        public string? LogoPath { get; set; }
        
        public DateTime? CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastUpdatedOn { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public int? CreatedBy { get; set; }
        
        public int? LastUpdatedBy { get; set; }
    }

    public class CompanyDto
    {
        public int CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyAddress { get; set; }
        public string? NTN { get; set; }
        public string? STRN { get; set; }
        public string? PRA { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonPhone { get; set; }
        public string? CompanyDescription { get; set; }
        public string? Industry { get; set; }
        public string? CompanySize { get; set; }
        public string? Location { get; set; }
        public string? LogoPath { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? LastUpdatedOn { get; set; }
        public bool IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public int? LastUpdatedBy { get; set; }
    }

    public class CreateCompanyRequest
    {
        [Required]
        public string? CompanyName { get; set; }
        public string? CompanyAddress { get; set; }
        public string? NTN { get; set; }
        public string? STRN { get; set; }
        public string? PRA { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonPhone { get; set; }
        public string? CompanyDescription { get; set; }
        public string? Industry { get; set; }
        public string? CompanySize { get; set; }
        public string? Location { get; set; }
        public string? LogoPath { get; set; }
    }

    public class UpdateCompanyRequest
    {
        [Required]
        public int CompanyId { get; set; }
        [Required]
        public string? CompanyName { get; set; }
        public string? CompanyAddress { get; set; }
        public string? NTN { get; set; }
        public string? STRN { get; set; }
        public string? PRA { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonPhone { get; set; }
        public string? CompanyDescription { get; set; }
        public string? Industry { get; set; }
        public string? CompanySize { get; set; }
        public string? Location { get; set; }
        public string? LogoPath { get; set; }
    }
}

