using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Vendor
{
    [Table("Vendors")]
    public class Vendor
    {
        [Key]
        public int VendorId { get; set; }

        [Required]
        [StringLength(200)]
        public string VendorName { get; set; }

        [Required]
        [StringLength(50)]
        public string VendorCode { get; set; }

        [Required]
        [StringLength(100)]
        public string Category { get; set; }

        [Required]
        [StringLength(500)]
        public string VendorAddress { get; set; }

        [Required]
        [StringLength(20)]
        public string PrimaryPhone { get; set; }

        [StringLength(20)]
        public string PhoneNumber2 { get; set; }

        [StringLength(20)]
        public string PhoneNumber3 { get; set; }

        [StringLength(200)]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(200)]
        public string Website { get; set; }

        [StringLength(100)]
        public string ContactPerson { get; set; }

        [StringLength(20)]
        public string ContactPersonPhone { get; set; }

        [StringLength(200)]
        [EmailAddress]
        public string ContactPersonEmail { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending";

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0.00m;

        public int TotalProjects { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalRevenue { get; set; } = 0.00m;

        [StringLength(50)]
        public string TaxNumber { get; set; }

        [StringLength(50)]
        public string BusinessLicense { get; set; }

        [StringLength(100)]
        public string BankName { get; set; }

        [StringLength(50)]
        public string BankAccountNumber { get; set; }

        [StringLength(100)]
        public string BankBranch { get; set; }

        [StringLength(200)]
        public string PaymentTerms { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal CreditLimit { get; set; } = 0.00m;

        [StringLength(1000)]
        public string Notes { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public DateTime? LastActiveOn { get; set; }

        // Navigation Properties
        public virtual ICollection<VendorDocument> Documents { get; set; } = new List<VendorDocument>();
        public virtual ICollection<VendorContact> Contacts { get; set; } = new List<VendorContact>();
        public virtual ICollection<VendorService> Services { get; set; } = new List<VendorService>();
        public virtual ICollection<VendorReview> Reviews { get; set; } = new List<VendorReview>();
        public virtual ICollection<VendorHistory> History { get; set; } = new List<VendorHistory>();

        // Foreign Keys
        [ForeignKey("CreatedBy")]
        public virtual User CreatedByUser { get; set; }

        [ForeignKey("ModifiedBy")]
        public virtual User ModifiedByUser { get; set; }

        // Computed Properties
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string DisplayName { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string StatusDisplay { get; set; }
    }

    [Table("VendorDocuments")]
    public class VendorDocument
    {
        [Key]
        public int DocumentId { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        [StringLength(50)]
        public string DocumentType { get; set; }

        [Required]
        [StringLength(200)]
        public string DocumentName { get; set; }

        [Required]
        [StringLength(500)]
        public string FileName { get; set; }

        [Required]
        [StringLength(1000)]
        public string FilePath { get; set; }

        public long FileSize { get; set; }

        [Required]
        [StringLength(100)]
        public string ContentType { get; set; }

        public bool IsVerified { get; set; } = false;

        public int? VerifiedBy { get; set; }

        public DateTime? VerifiedOn { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        // Navigation Properties
        [ForeignKey("VendorId")]
        public virtual Vendor Vendor { get; set; }

        [ForeignKey("VerifiedBy")]
        public virtual User VerifiedByUser { get; set; }
    }

    [Table("VendorContacts")]
    public class VendorContact
    {
        [Key]
        public int ContactId { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        [StringLength(100)]
        public string ContactName { get; set; }

        [StringLength(100)]
        public string ContactTitle { get; set; }

        [Required]
        [StringLength(20)]
        public string ContactPhone { get; set; }

        [StringLength(200)]
        [EmailAddress]
        public string ContactEmail { get; set; }

        public bool IsPrimary { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        // Navigation Properties
        [ForeignKey("VendorId")]
        public virtual Vendor Vendor { get; set; }
    }

    [Table("VendorServices")]
    public class VendorService
    {
        [Key]
        public int ServiceId { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        [StringLength(200)]
        public string ServiceName { get; set; }

        [StringLength(1000)]
        public string ServiceDescription { get; set; }

        [Required]
        [StringLength(100)]
        public string ServiceCategory { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        // Navigation Properties
        [ForeignKey("VendorId")]
        public virtual Vendor Vendor { get; set; }
    }

    [Table("VendorReviews")]
    public class VendorReview
    {
        [Key]
        public int ReviewId { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        public int ReviewedBy { get; set; }

        [Required]
        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; }

        [StringLength(200)]
        public string ReviewTitle { get; set; }

        [StringLength(1000)]
        public string ReviewComment { get; set; }

        public bool IsApproved { get; set; } = false;

        public int? ApprovedBy { get; set; }

        public DateTime? ApprovedOn { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public DateTime? ModifiedOn { get; set; }

        // Navigation Properties
        [ForeignKey("VendorId")]
        public virtual Vendor Vendor { get; set; }

        [ForeignKey("ReviewedBy")]
        public virtual User ReviewedByUser { get; set; }

        [ForeignKey("ApprovedBy")]
        public virtual User ApprovedByUser { get; set; }
    }

    [Table("VendorHistory")]
    public class VendorHistory
    {
        [Key]
        public int HistoryId { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Required]
        [StringLength(50)]
        public string Action { get; set; }

        [StringLength(100)]
        public string FieldName { get; set; }

        public string OldValue { get; set; }

        public string NewValue { get; set; }

        [Required]
        public int ChangedBy { get; set; }

        [Required]
        public DateTime ChangedOn { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("VendorId")]
        public virtual Vendor Vendor { get; set; }

        [ForeignKey("ChangedBy")]
        public virtual User ChangedByUser { get; set; }
    }
} 