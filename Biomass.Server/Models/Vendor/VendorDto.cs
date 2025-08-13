using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.Vendor
{
    public class VendorDto
    {
        public int VendorId { get; set; }
        public string VendorName { get; set; }
        public string VendorCode { get; set; }
        public string Category { get; set; }
        public string VendorAddress { get; set; }
        public string PrimaryPhone { get; set; }
        public string PhoneNumber2 { get; set; }
        public string PhoneNumber3 { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string ContactPerson { get; set; }
        public string ContactPersonPhone { get; set; }
        public string ContactPersonEmail { get; set; }
        public string Status { get; set; }
        public decimal Rating { get; set; }
        public int TotalProjects { get; set; }
        public decimal TotalRevenue { get; set; }
        public string TaxNumber { get; set; }
        public string BusinessLicense { get; set; }
        public string BankName { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankBranch { get; set; }
        public string PaymentTerms { get; set; }
        public decimal CreditLimit { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? LastActiveOn { get; set; }
        public string DisplayName { get; set; }
        public string StatusDisplay { get; set; }

        // Related data
        public List<VendorContactDto> Contacts { get; set; } = new List<VendorContactDto>();
        public List<VendorServiceDto> Services { get; set; } = new List<VendorServiceDto>();
        public List<VendorDocumentDto> Documents { get; set; } = new List<VendorDocumentDto>();
        public List<VendorReviewDto> Reviews { get; set; } = new List<VendorReviewDto>();

        // Audit fields
        public string CreatedByUserName { get; set; }
        public string ModifiedByUserName { get; set; }
    }

    public class CreateVendorRequest
    {
        [Required]
        [StringLength(200)]
        public string VendorName { get; set; }

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

        [Range(0, double.MaxValue)]
        public decimal CreditLimit { get; set; } = 0.00m;

        [StringLength(1000)]
        public string Notes { get; set; }

        // Related data
        public List<CreateVendorContactRequest> Contacts { get; set; } = new List<CreateVendorContactRequest>();
        public List<CreateVendorServiceRequest> Services { get; set; } = new List<CreateVendorServiceRequest>();
    }

    public class UpdateVendorRequest
    {
        [Required]
        [StringLength(200)]
        public string VendorName { get; set; }

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
        public string Status { get; set; }

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

        [Range(0, double.MaxValue)]
        public decimal CreditLimit { get; set; }

        [StringLength(1000)]
        public string Notes { get; set; }

        public bool IsActive { get; set; }

        // Related data
        public List<UpdateVendorContactRequest> Contacts { get; set; } = new List<UpdateVendorContactRequest>();
        public List<UpdateVendorServiceRequest> Services { get; set; } = new List<UpdateVendorServiceRequest>();
    }

    public class VendorSearchRequest
    {
        public string SearchTerm { get; set; }
        public string Status { get; set; }
        public string Category { get; set; }
        public bool? IsActive { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "CreatedOn";
        public string SortOrder { get; set; } = "DESC";
    }

    public class VendorStatisticsDto
    {
        public int TotalVendors { get; set; }
        public int ActiveVendors { get; set; }
        public int PendingVendors { get; set; }
        public int InactiveVendors { get; set; }
        public int SuspendedVendors { get; set; }
        public decimal AverageRating { get; set; }
        public int TotalProjects { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    // Contact DTOs
    public class VendorContactDto
    {
        public int ContactId { get; set; }
        public int VendorId { get; set; }
        public string ContactName { get; set; }
        public string ContactTitle { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEmail { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class CreateVendorContactRequest
    {
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
    }

    public class UpdateVendorContactRequest
    {
        public int? ContactId { get; set; }

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

        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; } = true;
    }

    // Service DTOs
    public class VendorServiceDto
    {
        public int ServiceId { get; set; }
        public int VendorId { get; set; }
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
        public string ServiceCategory { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class CreateVendorServiceRequest
    {
        [Required]
        [StringLength(200)]
        public string ServiceName { get; set; }

        [StringLength(1000)]
        public string ServiceDescription { get; set; }

        [Required]
        [StringLength(100)]
        public string ServiceCategory { get; set; }
    }

    public class UpdateVendorServiceRequest
    {
        public int? ServiceId { get; set; }

        [Required]
        [StringLength(200)]
        public string ServiceName { get; set; }

        [StringLength(1000)]
        public string ServiceDescription { get; set; }

        [Required]
        [StringLength(100)]
        public string ServiceCategory { get; set; }

        public bool IsActive { get; set; } = true;
    }

    // Document DTOs
    public class VendorDocumentDto
    {
        public int DocumentId { get; set; }
        public int VendorId { get; set; }
        public string DocumentType { get; set; }
        public string DocumentName { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }
        public string ContentType { get; set; }
        public bool IsVerified { get; set; }
        public int? VerifiedBy { get; set; }
        public DateTime? VerifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public string VerifiedByUserName { get; set; }
    }

    public class CreateVendorDocumentRequest
    {
        [Required]
        public string DocumentType { get; set; }

        [Required]
        public string DocumentName { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public string FilePath { get; set; }

        [Required]
        [Range(1, long.MaxValue)]
        public long FileSize { get; set; }

        [Required]
        public string ContentType { get; set; }
    }

    public class UpdateVendorDocumentRequest
    {
        public bool IsVerified { get; set; }
        public string DocumentName { get; set; }
    }

    // Review DTOs
    public class VendorReviewDto
    {
        public int ReviewId { get; set; }
        public int VendorId { get; set; }
        public int ReviewedBy { get; set; }
        public decimal Rating { get; set; }
        public string ReviewTitle { get; set; }
        public string ReviewComment { get; set; }
        public bool IsApproved { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ReviewedByUserName { get; set; }
        public string ApprovedByUserName { get; set; }
    }

    public class CreateVendorReviewRequest
    {
        [Required]
        [Range(1, 5)]
        public decimal Rating { get; set; }

        [StringLength(200)]
        public string ReviewTitle { get; set; }

        [StringLength(1000)]
        public string ReviewComment { get; set; }
    }

    public class UpdateVendorReviewRequest
    {
        public bool IsApproved { get; set; }
    }

    // History DTOs
    public class VendorHistoryDto
    {
        public int HistoryId { get; set; }
        public int VendorId { get; set; }
        public string Action { get; set; }
        public string FieldName { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public int ChangedBy { get; set; }
        public DateTime ChangedOn { get; set; }
        public string ChangedByUserName { get; set; }
    }

    // Bulk Operations
    public class BulkVendorStatusUpdateRequest
    {
        [Required]
        public List<int> VendorIds { get; set; }

        [Required]
        public string Status { get; set; }
    }

    public class VendorExportRequest
    {
        public string Status { get; set; }
        public string Category { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string ExportFormat { get; set; } = "Excel"; // Excel, CSV, PDF
    }
} 