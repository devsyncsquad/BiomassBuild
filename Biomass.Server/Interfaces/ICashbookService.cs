using Biomass.Api.Model;
using Biomass.Server.Models.Cashbook;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Interfaces
{
	public class CashbookDto
	{
		public long CashId { get; set; }
		public DateTime HappenedAt { get; set; }
		public int? CashKind { get; set; } 
		public decimal? Amount { get; set; }
		public string? Currency { get; set; } 
		public int? MoneyAccountId { get; set; }
		public int? WalletEmployeeId { get; set; }
		public int? CategoryId { get; set; }
		public int? CostCenterId { get; set; }
		public int? PaymentModeId { get; set; }
		public string? ReferenceNo { get; set; }
		public string? CounterpartyName { get; set; }
		public string? Remarks { get; set; }
		public string? Meta { get; set; }
		public string Status { get; set; } = string.Empty;
		public string? ReceiptPath { get; set; }
		public decimal? BankDelta { get; set; }
		public decimal? WalletDelta { get; set; }
	}

	public class CashTransactionDetailed
	{
		[Column("cash_id")]
		public int CashId { get; set; }
		
		[Column("happened_at")]
		public DateTime HappenedAt { get; set; }
		
		[Column("cash_kind")]
		public string? CashKind { get; set; }
		
		[Column("amount")]
		public decimal Amount { get; set; }
		
		[Column("currency")]
		public string Currency { get; set; } = string.Empty;
		
		[Column("money_account_id")]
		public int? MoneyAccountId { get; set; }
		
		[Column("money_account_name")]
		public string? MoneyAccountName { get; set; }
		
		[Column("wallet_employee_id")]
		public int? WalletEmployeeId { get; set; }
		
		[Column("employee_wallet_name")]
		public string? EmployeeWalletName { get; set; }
		
		[Column("category_id")]
		public int? CategoryId { get; set; }
		
		[Column("category_name")]
		public string? CategoryName { get; set; }
		
		[Column("cost_center_id")]
		public int? CostCenterId { get; set; }
		
		[Column("costcenter_name")]
		public string? CostCenterName { get; set; }
		
		[Column("cost_center_sub_id")]
		public int? CostCenterSubId { get; set; }
		
		[Column("costcenter_sub_name")]
		public string? CostCenterSubName { get; set; }
		
		[Column("payment_mode_id")]
		public int? PaymentModeId { get; set; }
		
		[Column("payment_mode_name")]
		public string? PaymentModeName { get; set; }
		
		[Column("reference_no")]
		public string? ReferenceNo { get; set; }
		
		[Column("counterparty_name")]
		public string? CounterpartyName { get; set; }
		
		[Column("remarks")]
		public string? Remarks { get; set; }
		
		[Column("meta")]
		public string? Meta { get; set; }
		
		[Column("bank_delta")]
		public decimal BankDelta { get; set; }
		
		[Column("wallet_delta")]
		public decimal WalletDelta { get; set; }
		
		[Column("status")]
		public string Status { get; set; } = string.Empty;
	}

	public class CreateCashbookRequest
	{
		public DateTime HappenedAt { get; set; } = DateTime.UtcNow;
		public int CashKindId { get; set; }
		public decimal Amount { get; set; }
		public string Currency { get; set; } = "PKR";
		public int? MoneyAccountId { get; set; }
		public int? WalletEmployeeId { get; set; }
		public int CategoryId { get; set; }
		public int? CostCenterId { get; set; }
		public int? PaymentModeId { get; set; }
		public string? ReferenceNo { get; set; }
		public string? CounterpartyName { get; set; }
		public string? Remarks { get; set; }
	}

	public class CancelCashbookRequest
	{
		public string CancellationReason { get; set; } = string.Empty;
	}

	public class WalletBalanceResponse
	{
		public int EmployeeId { get; set; }
		public decimal Balance { get; set; }
		public string Currency { get; set; } = "PKR";
	}

	public class CountResult
	{
		[Column("count_value")]
		public long count_value { get; set; }
	}

	public class EmployeeTransactionResponse
	{
		public IEnumerable<CashTransactionDetailed> Items { get; set; } = new List<CashTransactionDetailed>();
		public long TotalCount { get; set; }
		public int Page { get; set; }
		public int PageSize { get; set; }
		public int TotalPages { get; set; }
	}

	public interface ICashbookService
	{
		// Core CRUD
		Task<ServiceResponse<CashbookDto>> CreateCashbookEntryAsync(CreateCashbookRequest request, IFormFile? receipt);

		Task<long> SaveCashbookEntryAsync(CashbookEntryDto dto);

        Task<ServiceResponse<CashbookDto>> GetCashbookByIdAsync(long cashId);
		Task<ServiceResponse<bool>> CancelCashbookEntryAsync(long cashId, string cancellationReason);
		
		// Wallet Operations
		Task<ServiceResponse<WalletBalanceResponse>> GetWalletBalanceAsync(int employeeId);
		
		// Transaction History with Pagination (excluding cancelled)
		Task<ServiceResponse<EmployeeTransactionResponse>> GetEmployeeTransactionsAsync(
			int employeeId, 
			int days, 
			int page = 1, 
			int pageSize = 20);
		
		// Predefined Periods
		Task<ServiceResponse<EmployeeTransactionResponse>> GetEmployeeTransactionsLast7DaysAsync(
			int employeeId, int page = 1, int pageSize = 20);
		Task<ServiceResponse<EmployeeTransactionResponse>> GetEmployeeTransactionsLast14DaysAsync(
			int employeeId, int page = 1, int pageSize = 20);
		Task<ServiceResponse<EmployeeTransactionResponse>> GetEmployeeTransactionsLastMonthAsync(
			int employeeId, int page = 1, int pageSize = 20);
	}
}
