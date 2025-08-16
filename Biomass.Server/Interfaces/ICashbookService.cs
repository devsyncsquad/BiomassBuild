using Biomass.Api.Model;
using Biomass.Server.Models.Cashbook;
using System.Collections.Generic;

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

	public class EmployeeTransactionResponse
	{
		public IEnumerable<CashbookDto> Items { get; set; } = new List<CashbookDto>();
		public int TotalCount { get; set; }
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
