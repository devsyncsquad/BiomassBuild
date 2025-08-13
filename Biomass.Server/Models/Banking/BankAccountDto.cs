using System.ComponentModel.DataAnnotations;

namespace Biomass.Server.Models.Banking
{
    public class BankAccountDto
    {
        public int BankAccountId { get; set; }
        public string? BranchCode { get; set; }
        public string? BranchAddress { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string AccountIbanNo { get; set; } = string.Empty;
        public string? BankName { get; set; }
        public string? AccountType { get; set; }
        public int? EmployeeId { get; set; }
        public decimal OpeningBalance { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = "Active"; // Virtual property for UI
    }

    public class CreateBankAccountRequest
    {
        [Required(ErrorMessage = "Account name is required")]
        [StringLength(100, ErrorMessage = "Account name cannot exceed 100 characters")]
        public string AccountName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Account number is required")]
        [StringLength(50, ErrorMessage = "Account number cannot exceed 50 characters")]
        public string AccountNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Account IBAN number is required")]
        [StringLength(50, ErrorMessage = "Account IBAN number cannot exceed 50 characters")]
        public string AccountIbanNo { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Bank name cannot exceed 100 characters")]
        public string? BankName { get; set; }

        [StringLength(100, ErrorMessage = "Branch code cannot exceed 100 characters")]
        public string? BranchCode { get; set; }

        [StringLength(100, ErrorMessage = "Branch address cannot exceed 100 characters")]
        public string? BranchAddress { get; set; }

        [StringLength(50, ErrorMessage = "Account type cannot exceed 50 characters")]
        public string? AccountType { get; set; }

        public int? EmployeeId { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Opening balance must be non-negative")]
        public decimal OpeningBalance { get; set; } = 0;
    }

    public class UpdateBankAccountRequest
    {
        public int BankAccountId { get; set; }

        [Required(ErrorMessage = "Account name is required")]
        [StringLength(100, ErrorMessage = "Account name cannot exceed 100 characters")]
        public string AccountName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Account number is required")]
        [StringLength(50, ErrorMessage = "Account number cannot exceed 50 characters")]
        public string AccountNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Account IBAN number is required")]
        [StringLength(50, ErrorMessage = "Account IBAN number cannot exceed 50 characters")]
        public string AccountIbanNo { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Bank name cannot exceed 100 characters")]
        public string? BankName { get; set; }

        [StringLength(100, ErrorMessage = "Branch code cannot exceed 100 characters")]
        public string? BranchCode { get; set; }

        [StringLength(100, ErrorMessage = "Branch address cannot exceed 100 characters")]
        public string? BranchAddress { get; set; }

        [StringLength(50, ErrorMessage = "Account type cannot exceed 50 characters")]
        public string? AccountType { get; set; }

        public int? EmployeeId { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Opening balance must be non-negative")]
        public decimal OpeningBalance { get; set; } = 0;
    }

    public class BankAccountSearchRequest
    {
        public string? SearchTerm { get; set; }
        public string? AccountType { get; set; }
        public string? BankName { get; set; }
        public int? Page { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
    }
}
