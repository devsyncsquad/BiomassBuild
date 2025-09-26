using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Customer
{
    [Table("VUserCustomer")]
    public class VUserCustomer
    {
        [Column("user_id")]
        public int UserId { get; set; }
        
        [Column("customer_id")]
        public int CustomerId { get; set; }
        
        
        [Column("firstname")]
        public string? FirstName { get; set; }
        
        [Column("lastname")]
        public string? LastName { get; set; }
        
        [Column("email")]
        public string? Email { get; set; }
        
        [Column("phone")]
        public string? Phone { get; set; }
        
        [Column("companyname")]
        public string? CompanyName { get; set; }
        
        [Column("address")]
        public string? Address { get; set; }
        
        [Column("city")]
        public string? City { get; set; }
        
        [Column("state")]
        public string? State { get; set; }
        
        [Column("postalcode")]
        public string? PostalCode { get; set; }
        
        [Column("country")]
        public string? Country { get; set; }
        
        [Column("status")]
        public string? Status { get; set; }
        
        [Column("createddate")]
        public DateTime CreatedDate { get; set; }
        
        [Column("createdby")]
        public int CreatedBy { get; set; }
        
        [Column("lastupdatedon")]
        public DateTime? LastUpdatedOn { get; set; }
        
        [Column("lastupdatedby")]
        public int? LastUpdatedBy { get; set; }
        
        [Column("companyid")]
        public int? CompanyId { get; set; }
    }
}
