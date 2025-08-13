using Microsoft.EntityFrameworkCore;
using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Models.Banking;
using Biomass.Server.Interfaces;

namespace Biomass.Server.Services
{
    public class BankingService : IBankingService
    {
        private readonly ApplicationDbContext _context;

        public BankingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<List<BankAccountDto>>> GetAllBankAccountsAsync()
        {
            var response = new ServiceResponse<List<BankAccountDto>>();

            try
            {
                var bankAccounts = await _context.BankAccounts
                    .OrderByDescending(ba => ba.CreatedAt)
                    .Select(ba => new BankAccountDto
                    {
                        BankAccountId = ba.BankAccountId,
                        BranchCode = ba.BranchCode,
                        BranchAddress = ba.BranchAddress,
                        AccountName = ba.AccountName,
                        AccountNumber = ba.AccountNumber,
                        AccountIbanNo = ba.AccountIbanNo,
                        BankName = ba.BankName,
                        AccountType = ba.AccountType,
                        EmployeeId = ba.EmployeeId,
                        OpeningBalance = ba.OpeningBalance,
                        CreatedAt = ba.CreatedAt,
                        Status = "Active" // Default status for now
                    })
                    .ToListAsync();

                response.Success = true;
                response.Result = bankAccounts;
                response.Message = "Bank accounts retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving bank accounts: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<BankAccountDto>> GetBankAccountByIdAsync(int id)
        {
            var response = new ServiceResponse<BankAccountDto>();

            try
            {
                var bankAccount = await _context.BankAccounts
                    .Where(ba => ba.BankAccountId == id)
                    .Select(ba => new BankAccountDto
                    {
                        BankAccountId = ba.BankAccountId,
                        BranchCode = ba.BranchCode,
                        BranchAddress = ba.BranchAddress,
                        AccountName = ba.AccountName,
                        AccountNumber = ba.AccountNumber,
                        AccountIbanNo = ba.AccountIbanNo,
                        BankName = ba.BankName,
                        AccountType = ba.AccountType,
                        EmployeeId = ba.EmployeeId,
                        OpeningBalance = ba.OpeningBalance,
                        CreatedAt = ba.CreatedAt,
                        Status = "Active"
                    })
                    .FirstOrDefaultAsync();

                if (bankAccount == null)
                {
                    response.Success = false;
                    response.Message = "Bank account not found";
                    return response;
                }

                response.Success = true;
                response.Result = bankAccount;
                response.Message = "Bank account retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving bank account: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<BankAccountDto>> CreateBankAccountAsync(CreateBankAccountRequest request)
        {
            var response = new ServiceResponse<BankAccountDto>();

            try
            {
                // Check if account number already exists
                var existingAccount = await _context.BankAccounts
                    .FirstOrDefaultAsync(ba => ba.AccountNumber == request.AccountNumber);

                if (existingAccount != null)
                {
                    response.Success = false;
                    response.Message = "Account number already exists";
                    return response;
                }

                var bankAccount = new BankAccount
                {
                    BranchCode = request.BranchCode,
                    BranchAddress = request.BranchAddress,
                    AccountName = request.AccountName,
                    AccountNumber = request.AccountNumber,
                    AccountIbanNo = request.AccountIbanNo,
                    BankName = request.BankName,
                    AccountType = request.AccountType,
                    EmployeeId = request.EmployeeId,
                    OpeningBalance = request.OpeningBalance,
                    CreatedAt = DateTime.UtcNow
                };

                _context.BankAccounts.Add(bankAccount);
                await _context.SaveChangesAsync();

                var bankAccountDto = new BankAccountDto
                {
                    BankAccountId = bankAccount.BankAccountId,
                    BranchCode = bankAccount.BranchCode,
                    BranchAddress = bankAccount.BranchAddress,
                    AccountName = bankAccount.AccountName,
                    AccountNumber = bankAccount.AccountNumber,
                    AccountIbanNo = bankAccount.AccountIbanNo,
                    BankName = bankAccount.BankName,
                    AccountType = bankAccount.AccountType,
                    EmployeeId = bankAccount.EmployeeId,
                    OpeningBalance = bankAccount.OpeningBalance,
                    CreatedAt = bankAccount.CreatedAt,
                    Status = "Active"
                };

                response.Success = true;
                response.Result = bankAccountDto;
                response.Message = "Bank account created successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error creating bank account: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<BankAccountDto>> UpdateBankAccountAsync(int id, UpdateBankAccountRequest request)
        {
            var response = new ServiceResponse<BankAccountDto>();

            try
            {
                var bankAccount = await _context.BankAccounts.FindAsync(id);

                if (bankAccount == null)
                {
                    response.Success = false;
                    response.Message = "Bank account not found";
                    return response;
                }

                // Check if account number already exists for a different account
                var existingAccount = await _context.BankAccounts
                    .FirstOrDefaultAsync(ba => ba.AccountNumber == request.AccountNumber && ba.BankAccountId != id);

                if (existingAccount != null)
                {
                    response.Success = false;
                    response.Message = "Account number already exists";
                    return response;
                }

                // Update the bank account
                bankAccount.BranchCode = request.BranchCode;
                bankAccount.BranchAddress = request.BranchAddress;
                bankAccount.AccountName = request.AccountName;
                bankAccount.AccountNumber = request.AccountNumber;
                bankAccount.AccountIbanNo = request.AccountIbanNo;
                bankAccount.BankName = request.BankName;
                bankAccount.AccountType = request.AccountType;
                bankAccount.EmployeeId = request.EmployeeId;
                bankAccount.OpeningBalance = request.OpeningBalance;

                await _context.SaveChangesAsync();

                var bankAccountDto = new BankAccountDto
                {
                    BankAccountId = bankAccount.BankAccountId,
                    BranchCode = bankAccount.BranchCode,
                    BranchAddress = bankAccount.BranchAddress,
                    AccountName = bankAccount.AccountName,
                    AccountNumber = bankAccount.AccountNumber,
                    AccountIbanNo = bankAccount.AccountIbanNo,
                    BankName = bankAccount.BankName,
                    AccountType = bankAccount.AccountType,
                    EmployeeId = bankAccount.EmployeeId,
                    OpeningBalance = bankAccount.OpeningBalance,
                    CreatedAt = bankAccount.CreatedAt,
                    Status = "Active"
                };

                response.Success = true;
                response.Result = bankAccountDto;
                response.Message = "Bank account updated successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error updating bank account: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteBankAccountAsync(int id)
        {
            var response = new ServiceResponse<bool>();

            try
            {
                var bankAccount = await _context.BankAccounts.FindAsync(id);

                if (bankAccount == null)
                {
                    response.Success = false;
                    response.Message = "Bank account not found";
                    return response;
                }

                _context.BankAccounts.Remove(bankAccount);
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Result = true;
                response.Message = "Bank account deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error deleting bank account: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<List<BankAccountDto>>> SearchBankAccountsAsync(BankAccountSearchRequest request)
        {
            var response = new ServiceResponse<List<BankAccountDto>>();

            try
            {
                var query = _context.BankAccounts.AsQueryable();

                // Apply search filters
                if (!string.IsNullOrWhiteSpace(request.SearchTerm))
                {
                    var searchTerm = request.SearchTerm.ToLower();
                    query = query.Where(ba =>
                        ba.AccountName.ToLower().Contains(searchTerm) ||
                        ba.BankName != null && ba.BankName.ToLower().Contains(searchTerm) ||
                        ba.AccountNumber.Contains(searchTerm) ||
                        ba.AccountIbanNo.Contains(searchTerm)
                    );
                }

                if (!string.IsNullOrWhiteSpace(request.AccountType))
                {
                    query = query.Where(ba => ba.AccountType == request.AccountType);
                }

                if (!string.IsNullOrWhiteSpace(request.BankName))
                {
                    query = query.Where(ba => ba.BankName == request.BankName);
                }

                // Apply pagination
                var page = request.Page ?? 1;
                var pageSize = request.PageSize ?? 10;
                var skip = (page - 1) * pageSize;

                var bankAccounts = await query
                    .OrderByDescending(ba => ba.CreatedAt)
                    .Skip(skip)
                    .Take(pageSize)
                    .Select(ba => new BankAccountDto
                    {
                        BankAccountId = ba.BankAccountId,
                        BranchCode = ba.BranchCode,
                        BranchAddress = ba.BranchAddress,
                        AccountName = ba.AccountName,
                        AccountNumber = ba.AccountNumber,
                        AccountIbanNo = ba.AccountIbanNo,
                        BankName = ba.BankName,
                        AccountType = ba.AccountType,
                        EmployeeId = ba.EmployeeId,
                        OpeningBalance = ba.OpeningBalance,
                        CreatedAt = ba.CreatedAt,
                        Status = "Active"
                    })
                    .ToListAsync();

                response.Success = true;
                response.Result = bankAccounts;
                response.Message = "Bank accounts retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error searching bank accounts: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<int>> GetBankAccountCountAsync()
        {
            var response = new ServiceResponse<int>();

            try
            {
                var count = await _context.BankAccounts.CountAsync();

                response.Success = true;
                response.Result = count;
                response.Message = "Bank account count retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving bank account count: {ex.Message}";
            }

            return response;
        }
    }
}
