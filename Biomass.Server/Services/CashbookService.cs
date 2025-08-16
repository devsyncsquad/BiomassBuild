using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Cashbook;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using System.Text.Json;

namespace Biomass.Server.Services
{
	public class CashbookService : ICashbookService
	{
		private readonly ApplicationDbContext _db;
		private readonly IWebHostEnvironment _environment;
        private readonly string _uploadFolder = "wwwroot/uploads"; // Ensure this folder exists
        public CashbookService(ApplicationDbContext db, IWebHostEnvironment environment)
		{
			_db = db;
			_environment = environment;
		}

        public async Task<long> SaveCashbookEntryAsync(CashbookEntryDto dto)
        {
			
            string filePath = null;

            if (dto.ReceiptFile != null)
            {
                var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmssfff"); // e.g., 20250816_183245123
                var fileName = $"{timestamp}_{dto.ReceiptFile.FileName}";
                filePath = Path.Combine(_uploadFolder, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.ReceiptFile.CopyToAsync(stream);
            }
		
				var entry = new Cashbook
				{
					HappenedAt = dto.HappenedAt ?? DateTime.UtcNow,
					CashKindId = dto.CashKindId,
					Amount = dto.Amount,
					Currency = dto.Currency,
					MoneyAccountId = dto.MoneyAccountId,
					WalletEmployeeId = dto.WalletEmployeeId,
					CategoryId = (int)dto.CategoryId,
					CostCenterId = dto.CostCenterId,
					PaymentModeId = dto.PaymentModeId,
					ReferenceNo = dto.ReferenceNo,
					CounterpartyName = dto.CounterpartyName,
					Remarks = dto.Remarks,
					Status = dto.Status,
					//Meta = string.IsNullOrWhiteSpace(dto.MetaJson) ? null : JsonDocument.Parse(dto.MetaJson).RootElement,
					ReceiptPath = filePath
				};
            try
            {
                _db.Add(entry);
				await _db.SaveChangesAsync();
			}
			catch(Exception ex) {
				Console.WriteLine($"Error saving cashbook entry: {ex.Message}");
            }
            return entry.CashId;
        }


        public async Task<ServiceResponse<CashbookDto>> CreateCashbookEntryAsync(CreateCashbookRequest request, IFormFile? receipt)
		{
			var response = new ServiceResponse<CashbookDto>();
			try
			{
				// Validation
				if (request.Amount <= 0)
				{
					response.Success = false;
					response.Message = "Amount must be greater than 0";
					return response;
				}

				if (request.CashKindId <= 0)
				{
					response.Success = false;
					response.Message = "Cash kind is required";
					return response;
				}

				if (request.CategoryId <= 0)
				{
					response.Success = false;
					response.Message = "Category is required";
					return response;
				}

				// Handle receipt upload
				string? receiptPath = null;
				if (receipt != null)
				{
					receiptPath = await SaveReceiptFileAsync(receipt);
				}

				// Create cashbook entry
				var entity = new Cashbook
				{
					HappenedAt = request.HappenedAt,
					CashKindId = request.CashKindId,
					Amount = request.Amount,
					Currency = request.Currency ?? "PKR",
					MoneyAccountId = request.MoneyAccountId,
					WalletEmployeeId = request.WalletEmployeeId,
					CategoryId = request.CategoryId,
					CostCenterId = request.CostCenterId,
					PaymentModeId = request.PaymentModeId,
					ReferenceNo = request.ReferenceNo,
					CounterpartyName = request.CounterpartyName,
					Remarks = request.Remarks,
					Status = "Active",
					ReceiptPath = receiptPath
				};

				_db.Cashbooks.Add(entity);
				await _db.SaveChangesAsync();

				// Get the created entry from view
				var createdEntry = await GetCashbookFromViewAsync(entity.CashId);
				if (createdEntry != null)
				{
					response.Result = createdEntry;
					response.Success = true;
					response.Message = "Cashbook entry created successfully";
				}
				else
				{
					response.Success = false;
					response.Message = "Entry created but could not retrieve details";
				}
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<CashbookDto>> GetCashbookByIdAsync(long cashId)
		{
			var response = new ServiceResponse<CashbookDto>();
			try
			{
				var entry = await GetCashbookFromViewAsync(cashId);
				if (entry == null)
				{
					response.Success = false;
					response.Message = "Cashbook entry not found";
					return response;
				}

				response.Result = entry;
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<bool>> CancelCashbookEntryAsync(long cashId, string cancellationReason)
		{
			var response = new ServiceResponse<bool>();
			try
			{
				var entity = await _db.Cashbooks.FirstOrDefaultAsync(c => c.CashId == cashId);
				if (entity == null)
				{
					response.Success = false;
					response.Message = "Cashbook entry not found";
					return response;
				}

				if (entity.Status == "Cancelled")
				{
					response.Success = false;
					response.Message = "Entry is already cancelled";
					return response;
				}

				entity.Status = "Cancelled";
				entity.Remarks = string.IsNullOrEmpty(entity.Remarks) 
					? $"Cancelled: {cancellationReason}" 
					: $"{entity.Remarks} | Cancelled: {cancellationReason}";

				await _db.SaveChangesAsync();

				response.Result = true;
				response.Success = true;
				response.Message = "Cashbook entry cancelled successfully";
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<WalletBalanceResponse>> GetWalletBalanceAsync(int employeeId)
		{
			var response = new ServiceResponse<WalletBalanceResponse>();
			try
			{
				// Try to call the function fn_wallet_balance first
				try
				{
					// The function returns: employee_id, wallet_balance, currency
					var result = await _db.Database.SqlQueryRaw<dynamic>(
						"SELECT * FROM public.fn_wallet_balance({0})", employeeId).FirstOrDefaultAsync();
					
					if (result != null)
					{
						response.Result = new WalletBalanceResponse
						{
							EmployeeId = result.employee_id ?? employeeId,
							Balance = result.wallet_balance ?? 0,
							Currency = result.currency ?? "PKR"
						};
						response.Success = true;
						return response;
					}
				}
				catch (Exception ex)
				{
					// Log the error but continue with fallback
					Console.WriteLine($"Function call failed: {ex.Message}");
				}

				// Fallback: Calculate balance directly from cashbook table
				var balance = await CalculateWalletBalanceFromTableAsync(employeeId);
				
				response.Result = new WalletBalanceResponse
				{
					EmployeeId = employeeId,
					Balance = balance,
					Currency = "PKR" // Default currency
				};
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		private async Task<decimal> CalculateWalletBalanceFromTableAsync(int employeeId)
		{
			// Calculate balance from cashbook table
			// Cash In (positive) - Cash Out (negative)
			var cashIn = await _db.Cashbooks
				.Where(c => c.WalletEmployeeId == employeeId && c.Status != "Cancelled")
				.Where(c => c.CashKindId == 1) // Assuming 1 = Cash In
				.SumAsync(c => c.Amount);

			var cashOut = await _db.Cashbooks
				.Where(c => c.WalletEmployeeId == employeeId && c.Status != "Cancelled")
				.Where(c => c.CashKindId == 2) // Assuming 2 = Cash Out
				.SumAsync(c => c.Amount);

			return (decimal)(cashIn - cashOut);
		}

		public async Task<ServiceResponse<EmployeeTransactionResponse>> GetEmployeeTransactionsAsync(
			int employeeId, int days, int page = 1, int pageSize = 20)
		{
			var response = new ServiceResponse<EmployeeTransactionResponse>();
			try
			{
				page = page <= 0 ? 1 : page;
				pageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);

				var cutoffDate = DateTime.UtcNow.AddDays(-days);

				var query = _db.Cashbooks.AsNoTracking()
					.Where(c => c.WalletEmployeeId == employeeId)
					.Where(c => c.Status != "Cancelled")
					.Where(c => c.HappenedAt >= cutoffDate)
					.OrderByDescending(c => c.HappenedAt);

				var total = await query.CountAsync();
				var entities = await query
					.Skip((page - 1) * pageSize)
					.Take(pageSize)
					.ToListAsync();

				var items = new List<CashbookDto>();
				foreach (var entity in entities)
				{
					var dto = await GetCashbookFromViewAsync(entity.CashId);
					if (dto != null)
					{
						items.Add(dto);
					}
				}

				response.Result = new EmployeeTransactionResponse
				{
					Items = items,
					TotalCount = total,
					Page = page,
					PageSize = pageSize,
					TotalPages = (int)Math.Ceiling((double)total / pageSize)
				};
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<EmployeeTransactionResponse>> GetEmployeeTransactionsLast7DaysAsync(
			int employeeId, int page = 1, int pageSize = 20)
		{
			return await GetEmployeeTransactionsAsync(employeeId, 7, page, pageSize);
		}

		public async Task<ServiceResponse<EmployeeTransactionResponse>> GetEmployeeTransactionsLast14DaysAsync(
			int employeeId, int page = 1, int pageSize = 20)
		{
			return await GetEmployeeTransactionsAsync(employeeId, 14, page, pageSize);
		}

		public async Task<ServiceResponse<EmployeeTransactionResponse>> GetEmployeeTransactionsLastMonthAsync(
			int employeeId, int page = 1, int pageSize = 20)
		{
			return await GetEmployeeTransactionsAsync(employeeId, 30, page, pageSize);
		}

		private async Task<CashbookDto?> GetCashbookFromViewAsync(long cashId)
		{
			// This would map from v_cashbook_effects view
			// For now, we'll map from the main table and add placeholder values for bank_delta and wallet_delta
			var entity = await _db.Cashbooks.AsNoTracking()
				.FirstOrDefaultAsync(c => c.CashId == cashId);

			if (entity == null) return null;

			return new CashbookDto
			{
				CashId = entity.CashId,
				HappenedAt = entity.HappenedAt,
				CashKind =entity.CashKindId, // This should come from lookup
				Amount = entity.Amount,
				Currency = entity.Currency,
				MoneyAccountId = entity.MoneyAccountId,
				WalletEmployeeId = entity.WalletEmployeeId,
				CategoryId = entity.CategoryId,
				CostCenterId = entity.CostCenterId,
				PaymentModeId = entity.PaymentModeId,
				ReferenceNo = entity.ReferenceNo,
				CounterpartyName = entity.CounterpartyName,
				Remarks = entity.Remarks,
				Meta = entity.Meta,
				Status = entity.Status,
				ReceiptPath = entity.ReceiptPath,
				BankDelta = entity.Amount, // Placeholder - should come from view
				WalletDelta = entity.Amount // Placeholder - should come from view
			};
		}

		private async Task<string> SaveReceiptFileAsync(IFormFile receipt)
		{
			// Validate file size (10MB limit)
			if (receipt.Length > 10 * 1024 * 1024)
			{
				throw new InvalidOperationException("File size cannot exceed 10MB");
			}

			// Validate file type
			var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
			var fileExtension = Path.GetExtension(receipt.FileName).ToLowerInvariant();
			if (!allowedExtensions.Contains(fileExtension))
			{
				throw new InvalidOperationException("Only PDF, JPG, and PNG files are allowed");
			}

			// Create upload directory if it doesn't exist
			var uploadDir = Path.Combine(_environment.WebRootPath, "uploads", "cashbook_receipts");
			if (!Directory.Exists(uploadDir))
			{
				Directory.CreateDirectory(uploadDir);
			}

			// Generate unique filename
			var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
			var fileName = $"receipt_{timestamp}{fileExtension}";
			var filePath = Path.Combine(uploadDir, fileName);

			// Save file
			using (var stream = new FileStream(filePath, FileMode.Create))
			{
				await receipt.CopyToAsync(stream);
			}

			// Return relative path for database storage
			return $"/uploads/cashbook_receipts/{fileName}";
		}
	}
}
