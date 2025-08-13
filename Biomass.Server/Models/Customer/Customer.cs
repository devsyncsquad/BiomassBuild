using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Customer
{
    [Table("customers")]
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("customerid")]
        public int CustomerId { get; set; }
        
        [StringLength(100)]
        [Column("firstname")]
        public string? FirstName { get; set; }
        
        [StringLength(100)]
        [Column("lastname")]
        public string? LastName { get; set; }
        
        [EmailAddress]
        [StringLength(150)]
        [Column("email")]
        public string? Email { get; set; }
        
        [StringLength(30)]
        [Column("phone")]
        public string? Phone { get; set; }
        
        [StringLength(150)]
        [Column("companyname")]
        public string? CompanyName { get; set; }
        
        [StringLength(200)]
        [Column("address")]
        public string? Address { get; set; }
        
        [StringLength(100)]
        [Column("city")]
        public string? City { get; set; }
        
        [StringLength(100)]
        [Column("state")]
        public string? State { get; set; }
        
        [StringLength(20)]
        [Column("postalcode")]
        public string? PostalCode { get; set; }
        
        [StringLength(100)]
        [Column("country")]
        public string? Country { get; set; }
        
        [StringLength(50)]
        [Column("status")]
        public string? Status { get; set; }
        
        [Column("createddate")]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        [Column("createdby")]
        public int CreatedBy { get; set; }
        
        [Column("lastupdatedon")]
        public DateTime? LastUpdatedOn { get; set; }
        
        [Column("lastupdatedby")]
        public int? LastUpdatedBy { get; set; }
        
        // Navigation property
        public virtual ICollection<CustomerLocation> Locations { get; set; } = new List<CustomerLocation>();
        public virtual ICollection<MaterialRate> MaterialRates { get; set; } = new List<MaterialRate>();
    }

    public class CustomerDto
    {
        public int CustomerId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? CompanyName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public int LocationCount { get; set; }
    }

    public class CreateCustomerRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? CompanyName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public string? Status { get; set; } = "active";
    }

    public class UpdateCustomerRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? CompanyName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public string? Status { get; set; }
    }
} 