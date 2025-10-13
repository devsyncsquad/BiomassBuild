using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Cashbook;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using System.Text.Json;
using Npgsql;
using Biomass.Server.Models;

namespace Biomass.Server.Services
{
	public class CashbookService : ICashbookService
	{
		private readonly ApplicationDbContext _db;
		private readonly IWebHostEnvironment _environment;
        
        public CashbookService(ApplicationDbContext db, IWebHostEnvironment environment)
		{
			_db = db;
			_environment = environment;
		}

        public async Task<long> SaveCashbookEntryAsync(CashbookEntryDto dto)
        {
            string? receiptPath = null;

            if (dto.ReceiptPath != null)
            {
                receiptPath = await SaveReceiptFileAsync(dto.ReceiptPath);
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
					ReceiptPath = receiptPath,
					CostCenterSubId=dto.CostCenterSubId,
					DispatchId = dto.DispatchId,
                    //TransferGroupId = dto.TransferGroupId,
					//TransferRole=dto.TransferRole
					SlipNumber = dto.SlipNumber
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

        ////////////////
        public async Task<(long OutId, long InId)> SaveTransferCashbookEntriesAsync(CashbookTransferEntryDto dto)
        {
            // Make sure both From and To are provided
            if ((dto.MoneyAccountFrom == null && dto.WalletEmployeeFrom == null) ||
                (dto.MoneyAccountTo == null && dto.WalletEmployeeTo == null))
            {
                throw new ArgumentException("Both From and To accounts must be specified.");
            }

            // Ensure both entries share same TransferGroupId
            var groupId = Guid.NewGuid();

            // Save receipt file (if any)
            string? receiptPath = null;
            if (dto.ReceiptPath != null)
            {
                receiptPath = await SaveReceiptFileAsync(dto.ReceiptPath);
            }

            // "Out" entry
            var outEntry = new Cashbook
            {
                HappenedAt = dto.HappenedAt ?? DateTime.UtcNow,
                CashKindId = dto.CashKindId,
                Amount = dto.Amount,
                Currency = dto.Currency,
                MoneyAccountId = dto.MoneyAccountFrom,
                WalletEmployeeId = dto.WalletEmployeeFrom,
                CategoryId = (int)dto.CategoryId,
                CostCenterId = dto.CostCenterId,
                PaymentModeId = dto.PaymentModeId,
                ReferenceNo = dto.ReferenceNo,
                CounterpartyName = dto.CounterpartyName,
                Remarks = dto.Remarks,
                Status = "Completed",
                ReceiptPath = receiptPath,
                CostCenterSubId = dto.CostCenterSubId,
                DispatchId = dto.DispatchId,
                TransferGroupId = groupId,
                TransferRole = "Out",
                SlipNumber = dto.SlipNumber
            };

            // "In" entry
            var inEntry = new Cashbook
            {
                HappenedAt = dto.HappenedAt ?? DateTime.UtcNow,
                CashKindId = dto.CashKindId,
                Amount = dto.Amount,
                Currency = dto.Currency,
                MoneyAccountId = dto.MoneyAccountTo,
                WalletEmployeeId = dto.WalletEmployeeTo,
                CategoryId = (int)dto.CategoryId,
                CostCenterId = dto.CostCenterId,
                PaymentModeId = dto.PaymentModeId,
                ReferenceNo = dto.ReferenceNo,
                CounterpartyName = dto.CounterpartyName,
                Remarks = dto.Remarks,
                Status = dto.Status,
                ReceiptPath = receiptPath,
                CostCenterSubId = dto.CostCenterSubId,
                DispatchId = dto.DispatchId,
                TransferGroupId = groupId,
                TransferRole = "In",
                SlipNumber = dto.SlipNumber
            };

            try
            {
                _db.Add(outEntry);
                _db.Add(inEntry);
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving transfer entries: {ex.Message}");
                throw;
            }

            return (outEntry.CashId, inEntry.CashId);
        }


        ///////////////////
        public async Task<ServiceResponse<CashbookDto>> CashInsertAsync(CashbookEntryDto dto)
        {
            var response = new ServiceResponse<CashbookDto>();

            try
            {
                using var transaction = await _db.Database.BeginTransactionAsync();

                // Save the cashbook entry first
                var cashbookId = await SaveCashbookEntryAsync(dto);

                // Create AP Ledger entry
                var apLedgerEntry = new ApLedger
                {
                    VendorId = (int)dto.VendorId, // Use vendor_id
                    HappenedAt = dto.HappenedAt ?? DateTime.UtcNow,
                    EntryKind = "Payment", // Set to "Payment" as requested
                    Amount = dto.Amount ?? 0,
                    Currency = "PKR", // Set to PKR as requested
                    DispatchId = dto.DispatchId, // Map from cashbook DispatchId
                    CashId = cashbookId,
                    ReferenceNo = dto.ReferenceNo,
                    Remarks = dto.Remarks,
                    CreatedBy = dto.WalletEmployeeId,
                    CreatedAt = DateTime.UtcNow
                };

                _db.ApLedgers.Add(apLedgerEntry);
                await _db.SaveChangesAsync();

                await transaction.CommitAsync();

                // Get the created cashbook entry
                var cashbook = await _db.Cashbooks.FindAsync(cashbookId);
                if (cashbook != null)
                {
                    var cashbookDto = new CashbookDto
                    {
                        CashId = cashbook.CashId,
                        HappenedAt = cashbook.HappenedAt,
                        CashKind = cashbook.CashKindId,
                        Amount = cashbook.Amount,
                        Currency = cashbook.Currency,
                        MoneyAccountId = cashbook.MoneyAccountId,
                        WalletEmployeeId = cashbook.WalletEmployeeId,
                        CategoryId = cashbook.CategoryId,
                        CostCenterId = cashbook.CostCenterId,
                        CostCenterSubId = cashbook.CostCenterSubId,
                        PaymentModeId = cashbook.PaymentModeId,
                        ReferenceNo = cashbook.ReferenceNo,
                        CounterpartyName = cashbook.CounterpartyName,
                        Remarks = cashbook.Remarks,
                        Status = cashbook.Status,
                        ReceiptPath = cashbook.ReceiptPath,
                        DispatchId = cashbook.DispatchId,
                        SlipNumber = cashbook.SlipNumber
                    };

                    response.Success = true;
                    response.Result = cashbookDto;
                    response.Message = "Cashbook entry and AP Ledger entry created successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Failed to retrieve created cashbook entry";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error creating cashbook entry: {ex.Message}";
            }

            return response;
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
					ReceiptPath = receiptPath,
					SlipNumber = request.SlipNumber
				};

				_db.Cashbooks.Add(entity);
				await _db.SaveChangesAsync();

				// Create a basic response with the created entity
				response.Result = new CashbookDto
				{
					CashId = entity.CashId,
					HappenedAt = entity.HappenedAt,
					CashKind = entity.CashKindId,
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
					Status = entity.Status,
					ReceiptPath = entity.ReceiptPath,
					SlipNumber = entity.SlipNumber
				};
				response.Success = true;
				response.Message = "Cashbook entry created successfully";
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
				var entity = await _db.Cashbooks.AsNoTracking()
					.FirstOrDefaultAsync(c => c.CashId == cashId);

				if (entity == null)
				{
					response.Success = false;
					response.Message = "Cashbook entry not found";
					return response;
				}

				response.Result = new CashbookDto
				{
					CashId = entity.CashId,
					HappenedAt = entity.HappenedAt,
					CashKind = entity.CashKindId,
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
					SlipNumber = entity.SlipNumber
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

		public async Task<ServiceResponse<bool>> DeleteCashbookEntryAsync(long cashId)
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

				// Delete the associated receipt file if it exists
				if (!string.IsNullOrEmpty(entity.ReceiptPath))
				{
					try
					{
						var fileName = Path.GetFileName(entity.ReceiptPath);
				var contentRootPath = _environment.ContentRootPath;
				if (!string.IsNullOrEmpty(contentRootPath))
				{
					var uploadFolder = Path.Combine(contentRootPath, "uploads", "Receipts");
							var fullPath = Path.Combine(uploadFolder, fileName);
							if (File.Exists(fullPath))
							{
								File.Delete(fullPath);
							}
						}
					}
					catch (Exception fileEx)
					{
						// Log the file deletion error but continue with database deletion
						Console.WriteLine($"Error deleting receipt file: {fileEx.Message}");
					}
				}

				// Remove the cashbook entry from database
				_db.Cashbooks.Remove(entity);
				await _db.SaveChangesAsync();

				response.Result = true;
				response.Success = true;
				response.Message = "Cashbook entry deleted successfully";
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
					// Use ExecuteSqlRaw to avoid EF materialization issues
					var command = _db.Database.GetDbConnection().CreateCommand();
					command.CommandText = "SELECT * FROM public.fn_wallet_balance(@employeeId)";
					command.Parameters.Add(new Npgsql.NpgsqlParameter("@employeeId", employeeId));
					
					_db.Database.OpenConnection();
					using var reader = await command.ExecuteReaderAsync();
					
					if (await reader.ReadAsync())
					{
						response.Result = new WalletBalanceResponse
						{
							EmployeeId = reader["employee_id"] != DBNull.Value ? Convert.ToInt32(reader["employee_id"]) : employeeId,
							Balance = reader["wallet_balance"] != DBNull.Value ? Convert.ToDecimal(reader["wallet_balance"]) : 0,
							Currency = reader["currency"] != DBNull.Value ? reader["currency"].ToString() : "PKR"
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
				//var balance = await CalculateWalletBalanceFromTableAsync(employeeId);
				
				//response.Result = new WalletBalanceResponse
				//{
				//	EmployeeId = employeeId,
				//	Balance = balance,
				//	Currency = "PKR" // Default currency
				//};
				//response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		//private async Task<decimal> CalculateWalletBalanceFromTableAsync(int employeeId)
		//{
		//	// Calculate balance from cashbook table
		//	// Cash In (positive) - Cash Out (negative)
		//	var cashIn = await _db.Cashbooks
		//		.Where(c => c.WalletEmployeeId == employeeId && c.Status != "Cancelled")
		//		//.Where(c => c.CashKindId == 1) // Assuming 1 = Cash In
		//		.SumAsync(c => c.Amount);

		//	var cashOut = await _db.Cashbooks
		//		.Where(c => c.WalletEmployeeId == employeeId && c.Status != "Cancelled")
		//		//.Where(c => c.CashKindId == 2) // Assuming 2 = Cash Out
		//		.SumAsync(c => c.Amount);

		//	return (decimal)(cashIn - cashOut);
		//}

		public async Task<ServiceResponse<EmployeeTransactionResponse>> GetEmployeeTransactionsAsync(
			int employeeId, int days, int page = 1, int pageSize = 20)
		{
			var response = new ServiceResponse<EmployeeTransactionResponse>();
			try
			{
				page = page <= 0 ? 1 : page;
				pageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);

				var cutoffDate = DateTime.UtcNow.AddDays(-days);

				// Raw SQL query using v_cashbook_effects view
				var sql = @"
					SELECT 
						cash_id, happened_at, cash_kind, amount, currency,
						money_account_id, money_account_name, wallet_employee_id, employee_wallet_name,
						category_id, category_name, cost_center_id, costcenter_name, cost_center_sub_id, costcenter_sub_name,
						payment_mode_id, payment_mode_name, reference_no, counterparty_name, remarks, meta,
						bank_delta, wallet_delta, status, slipnumber
					FROM v_cashbook_effects 
					WHERE wallet_employee_id = {0} 
						AND status != 'Cancelled' 
						AND happened_at >= {1}
					ORDER BY happened_at DESC
					OFFSET {2} ROWS 
					FETCH NEXT {3} ROWS ONLY";

				var offset = (page - 1) * pageSize;

				// Get paginated results
				var items = await _db.Database.SqlQueryRaw<CashTransactionDetailed>(
					sql, employeeId, cutoffDate, offset, pageSize
				).ToListAsync();

				// Get total count for pagination
				var countSql = @"
					SELECT COUNT(*) as count_value
					FROM v_cashbook_effects 
					WHERE wallet_employee_id = {0} 
						AND status != 'Cancelled' 
						AND happened_at >= {1}";

				var total = await _db.Database.SqlQueryRaw<CountResult>(
					countSql, employeeId, cutoffDate
				).FirstOrDefaultAsync();

				var totalCount = total?.count_value ?? 0;

				response.Result = new EmployeeTransactionResponse
				{
					Items = items,
					TotalCount = totalCount,
					Page = page,
					PageSize = pageSize,
					TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
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

		public async Task<ServiceResponse<EmployeeTransactionResponse>> GetPendingTransactionsByEmployeeAsync(
			int employeeId, string status)
		{
			var response = new ServiceResponse<EmployeeTransactionResponse>();
			try
			{
				// Build the SQL query for transactions by status and employee
				var sql = @"
					SELECT 
						cash_id, happened_at, cash_kind, amount, currency,
						money_account_id, money_account_name, wallet_employee_id, employee_wallet_name,
						category_id, category_name, cost_center_id, costcenter_name, cost_center_sub_id, costcenter_sub_name,
						payment_mode_id, payment_mode_name, reference_no, counterparty_name, remarks, meta,
						bank_delta, wallet_delta, status, slipnumber
					FROM v_cashbook_effects 
					WHERE wallet_employee_id = {0} 
						AND status = {1}
					ORDER BY happened_at DESC";

				// Execute query
				var items = await _db.Database.SqlQueryRaw<CashTransactionDetailed>(
					sql, employeeId, status
				).ToListAsync();

				response.Result = new EmployeeTransactionResponse
				{
					Items = items,
					TotalCount = items.Count, // Use actual items count
					Page = 1, // No pagination, so always page 1
					PageSize = items.Count, // Page size equals actual items count
					TotalPages = 1 // Only one page since no pagination
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

		private async Task<string> SaveReceiptFileAsync(IFormFile receipt)
		{
			try
			{
				Console.WriteLine($"SaveReceiptFileAsync: Starting file save for {receipt.FileName}");
				Console.WriteLine($"SaveReceiptFileAsync: File size: {receipt.Length} bytes");
				Console.WriteLine($"SaveReceiptFileAsync: Content type: {receipt.ContentType}");

				// Validate file size (10MB limit)
				if (receipt.Length > 10 * 1024 * 1024)
				{
					Console.WriteLine("SaveReceiptFileAsync: File size exceeds 10MB limit");
					throw new InvalidOperationException("File size cannot exceed 10MB");
				}

				// Validate file type
				var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
				var fileExtension = Path.GetExtension(receipt.FileName).ToLowerInvariant();
				Console.WriteLine($"SaveReceiptFileAsync: File extension: {fileExtension}");
				
				if (!allowedExtensions.Contains(fileExtension))
				{
					Console.WriteLine($"SaveReceiptFileAsync: Invalid file extension: {fileExtension}");
					throw new InvalidOperationException("Only PDF, JPG, and PNG files are allowed");
				}

			// Use ContentRootPath for uploads (consistent with dispatch_receipts pattern)
			// This keeps all user uploads outside of wwwroot for better security and organization
			var contentRootPath = _environment.ContentRootPath;
			Console.WriteLine($"SaveReceiptFileAsync: ContentRootPath: {_environment.ContentRootPath}");
			Console.WriteLine($"SaveReceiptFileAsync: Using path: {contentRootPath}");
			
			if (string.IsNullOrEmpty(contentRootPath))
			{
				// Fallback to current directory if ContentRootPath is null
				contentRootPath = Directory.GetCurrentDirectory();
				Console.WriteLine($"SaveReceiptFileAsync: Using fallback path: {contentRootPath}");
			}
			
			var uploadFolder = Path.Combine(contentRootPath, "uploads", "Receipts");
				Console.WriteLine($"SaveReceiptFileAsync: Upload folder: {uploadFolder}");
				
				// Create Receipts directory if it doesn't exist
				if (!Directory.Exists(uploadFolder))
				{
					Console.WriteLine($"SaveReceiptFileAsync: Creating directory: {uploadFolder}");
					try
					{
						Directory.CreateDirectory(uploadFolder);
						Console.WriteLine($"SaveReceiptFileAsync: Directory created successfully");
					}
					catch (Exception ex)
					{
						Console.WriteLine($"SaveReceiptFileAsync: Failed to create directory: {ex.Message}");
						throw new InvalidOperationException($"Failed to create upload directory: {uploadFolder}. Error: {ex.Message}", ex);
					}
				}
				else
				{
					Console.WriteLine($"SaveReceiptFileAsync: Directory already exists");
				}

				// Generate unique filename
				var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
				var fileName = $"receipt_{timestamp}_{Guid.NewGuid().ToString("N")[..8]}{fileExtension}";
				var filePath = Path.Combine(uploadFolder, fileName);
				Console.WriteLine($"SaveReceiptFileAsync: Full file path: {filePath}");

				// Save file
				using (var stream = new FileStream(filePath, FileMode.Create))
				{
					Console.WriteLine($"SaveReceiptFileAsync: Starting file copy");
					await receipt.CopyToAsync(stream);
					Console.WriteLine($"SaveReceiptFileAsync: File copy completed");
				}

				// Verify file was saved
				if (File.Exists(filePath))
				{
					var fileInfo = new FileInfo(filePath);
					Console.WriteLine($"SaveReceiptFileAsync: File saved successfully. Size: {fileInfo.Length} bytes");
				}
				else
				{
					Console.WriteLine($"SaveReceiptFileAsync: ERROR - File was not saved!");
					throw new InvalidOperationException("File was not saved successfully");
				}

				// Return relative path for database storage
				var relativePath = $"/uploads/Receipts/{fileName}";
				Console.WriteLine($"SaveReceiptFileAsync: Returning relative path: {relativePath}");
				return relativePath;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"SaveReceiptFileAsync: Exception occurred: {ex.Message}");
				Console.WriteLine($"SaveReceiptFileAsync: Stack trace: {ex.StackTrace}");
				throw;
			}
		}

        public async Task<ServiceResponse<CashbookDto>> UpdateCashbookStatusAsync(long cashId, string newStatus)
        {
            try
            {
                var data = _db.Cashbooks.FirstOrDefault(x => x.CashId == cashId);
                if (data == null)
                {
                    return new ServiceResponse<CashbookDto>
                    {
                        Success = false,
                        Message = "Cashbook entry not found"
                    };
                }

                data.Status = newStatus;
                await _db.SaveChangesAsync();

                return new ServiceResponse<CashbookDto>
                {
                    Success = true,
                    Message = "Status updated successfully",
                    //Data = new CashbookDto
                    //{
                    //    CashId = data.CashId,
                    //    Status = data.Status,
                    //    // Add other properties as needed
                    //}
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<CashbookDto>
                {
                    Success = false,
                    Message = $"Error updating status: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<List<CashTransactionDetailed>>> GetAdvanceEntriesAsync()
        {
            var response = new ServiceResponse<List<CashTransactionDetailed>>();
            try
            {
                // Raw SQL query using v_cashbook_effects view
                var sql = @"
                    SELECT 
                        cash_id, happened_at, cash_kind, amount, currency,
                        money_account_id, money_account_name, wallet_employee_id, employee_wallet_name,
                        category_id, category_name, cost_center_id, costcenter_name, cost_center_sub_id, costcenter_sub_name,
                        payment_mode_id, payment_mode_name, reference_no, counterparty_name, remarks, meta,
                        bank_delta, wallet_delta, status, slipnumber
                    FROM v_cashbook_effects 
                    WHERE remarks = 'ADVANCE' 
                        AND dispatch_id IS NULL
                    ORDER BY happened_at DESC";

                // Execute query
                var items = await _db.Database.SqlQueryRaw<CashTransactionDetailed>(sql).ToListAsync();

                response.Result = items;
                response.Success = true;
                response.Message = $"Total records: {items.Count}";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<List<CashTransactionDetailed>>> GetAdvanceEntriesByCostCenterSubIdAsync(int costCenterSubId)
        {
            var response = new ServiceResponse<List<CashTransactionDetailed>>();
            try
            {
                // Raw SQL query using v_cashbook_effects view
                var sql = @"
                    SELECT 
                        cash_id, happened_at, cash_kind, amount, currency,
                        money_account_id, money_account_name, wallet_employee_id, employee_wallet_name,
                        category_id, category_name, cost_center_id, costcenter_name, cost_center_sub_id, costcenter_sub_name,
                        payment_mode_id, payment_mode_name, reference_no, counterparty_name, remarks, meta,
                        bank_delta, wallet_delta, status, slipnumber
                    FROM v_cashbook_effects 
                    WHERE cost_center_sub_id = {0}
                        AND remarks = 'ADVANCE' 
                        AND dispatch_id IS NULL
                    ORDER BY happened_at DESC";

                // Execute query
                var items = await _db.Database.SqlQueryRaw<CashTransactionDetailed>(sql, costCenterSubId).ToListAsync();

                response.Result = items;
                response.Success = true;
                response.Message = $"Found {items.Count} advance entries";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }


    }
}
