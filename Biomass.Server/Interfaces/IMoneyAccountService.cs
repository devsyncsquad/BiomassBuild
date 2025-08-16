using Biomass.Api.Model;
using System.Collections.Generic;

namespace Biomass.Server.Interfaces
{
    public class MoneyAccountDto
    {
        public int MoneyAccountId { get; set; }
        public string? AccountCode { get; set; }
        public string Name { get; set; } = string.Empty;
        public int KindLookupId { get; set; }
        public string? KindLookupName { get; set; } // Include lookup name
        public string? AccountHolder { get; set; }
        public string? CompanyRegNo { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? BranchCode { get; set; }
        public string? AccountNumber { get; set; }
        public string? Iban { get; set; }
        public string? SwiftBic { get; set; }
        public string? WalletProvider { get; set; }
        public string? WalletPhone { get; set; }
        public string Currency { get; set; } = "PKR";
        public decimal OpeningBalance { get; set; }
        public DateTime? OpeningBalanceAsOf { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public string? Notes { get; set; }
        public string? Meta { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }

    public class CreateMoneyAccountRequest
    {
        public string? AccountCode { get; set; }
        public string Name { get; set; } = string.Empty;
        public int KindLookupId { get; set; }
        public string? AccountHolder { get; set; }
        public string? CompanyRegNo { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? BranchCode { get; set; }
        public string? AccountNumber { get; set; }
        public string? Iban { get; set; }
        public string? SwiftBic { get; set; }
        public string? WalletProvider { get; set; }
        public string? WalletPhone { get; set; }
        public string Currency { get; set; } = "PKR";
        public decimal OpeningBalance { get; set; } = 0;
        public DateTime? OpeningBalanceAsOf { get; set; }
        public bool IsDefault { get; set; } = false;
        public string? Notes { get; set; }
        public string? MetaJson { get; set; }
    }

    public class UpdateMoneyAccountRequest
    {
        public string? AccountCode { get; set; }
        public string Name { get; set; } = string.Empty;
        public int KindLookupId { get; set; }
        public string? AccountHolder { get; set; }
        public string? CompanyRegNo { get; set; }
        public string? BankName { get; set; }
        public string? BranchName { get; set; }
        public string? BranchCode { get; set; }
        public string? AccountNumber { get; set; }
        public string? Iban { get; set; }
        public string? SwiftBic { get; set; }
        public string? WalletProvider { get; set; }
        public string? WalletPhone { get; set; }
        public string Currency { get; set; } = "PKR";
        public decimal OpeningBalance { get; set; }
        public DateTime? OpeningBalanceAsOf { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; } = true;
        public string? Notes { get; set; }
        public string? MetaJson { get; set; }
    }

    public class MoneyAccountListResponse
    {
        public IEnumerable<MoneyAccountDto> Items { get; set; } = new List<MoneyAccountDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public interface IMoneyAccountService
    {
        // Core CRUD operations
        Task<ServiceResponse<MoneyAccountDto>> CreateAsync(CreateMoneyAccountRequest request, string? createdBy);
        Task<ServiceResponse<MoneyAccountDto>> UpdateAsync(int id, UpdateMoneyAccountRequest request, string? updatedBy);
        Task<ServiceResponse<bool>> DeleteAsync(int id, string? deletedBy);
        Task<ServiceResponse<MoneyAccountDto>> GetByIdAsync(int id);
        
        // List operations with pagination and filtering
        Task<ServiceResponse<MoneyAccountListResponse>> GetAllAsync(
            int page = 1, 
            int pageSize = 20, 
            int? kindLookupId = null, 
            bool? isActive = null);
        
        // Utility operations
        Task<ServiceResponse<bool>> SetDefaultAsync(int id, string? updatedBy);
        Task<ServiceResponse<MoneyAccountDto?>> GetDefaultAccountAsync();
        
        // Get money accounts by kind lookup ID
        Task<ServiceResponse<List<MoneyAccountDto>>> GetMoneyAccountsByKindLookupIdAsync(int kindLookupId);
    }
}
