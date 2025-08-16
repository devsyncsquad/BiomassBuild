using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.MoneyAccount;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Biomass.Server.Services
{
    public class MoneyAccountService : IMoneyAccountService
    {
        private readonly ApplicationDbContext _db;

        public MoneyAccountService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResponse<MoneyAccountDto>> CreateAsync(CreateMoneyAccountRequest request, string? createdBy)
        {
            var response = new ServiceResponse<MoneyAccountDto>();
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(request.Name))
                {
                    response.Success = false;
                    response.Message = "Name is required";
                    return response;
                }

                // Validate that kind_lookup_id exists
                var lookupExists = await _db.Lookups.AnyAsync(l => l.LookUpId == request.KindLookupId);
                if (!lookupExists)
                {
                    response.Success = false;
                    response.Message = "Invalid kind lookup ID";
                    return response;
                }

                // Handle default account logic
                if (request.IsDefault)
                {
                    await RemoveExistingDefaultAsync();
                }

                // Parse meta JSON if provided
                JsonElement? meta = null;
                if (!string.IsNullOrWhiteSpace(request.MetaJson))
                {
                    try
                    {
                        meta = JsonDocument.Parse(request.MetaJson).RootElement;
                    }
                    catch
                    {
                        response.Success = false;
                        response.Message = "Invalid meta JSON format";
                        return response;
                    }
                }

                var entity = new MoneyAccount
                {
                    AccountCode = request.AccountCode?.Trim(),
                    Name = request.Name.Trim(),
                    KindLookupId = request.KindLookupId,
                    AccountHolder = request.AccountHolder?.Trim(),
                    CompanyRegNo = request.CompanyRegNo?.Trim(),
                    BankName = request.BankName?.Trim(),
                    BranchName = request.BranchName?.Trim(),
                    BranchCode = request.BranchCode?.Trim(),
                    AccountNumber = request.AccountNumber?.Trim(),
                    Iban = request.Iban?.Trim(),
                    SwiftBic = request.SwiftBic?.Trim(),
                    WalletProvider = request.WalletProvider?.Trim(),
                    WalletPhone = request.WalletPhone?.Trim(),
                    Currency = request.Currency ?? "PKR",
                    OpeningBalance = request.OpeningBalance,
                    OpeningBalanceAsOf = request.OpeningBalanceAsOf ?? DateTime.UtcNow.Date,
                    IsDefault = request.IsDefault,
                    IsActive = true,
                    Notes = request.Notes?.Trim(),
                    Meta = meta,
                    CreatedBy = createdBy,
                    UpdatedBy = createdBy
                };

                _db.MoneyAccounts.Add(entity);
                await _db.SaveChangesAsync();

                // Get the created entry with lookup details
                var createdEntry = await GetByIdAsync(entity.MoneyAccountId);
                response.Result = createdEntry.Result;
                response.Success = true;
                response.Message = "Money account created successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<MoneyAccountDto>> UpdateAsync(int id, UpdateMoneyAccountRequest request, string? updatedBy)
        {
            var response = new ServiceResponse<MoneyAccountDto>();
            try
            {
                var entity = await _db.MoneyAccounts.FirstOrDefaultAsync(m => m.MoneyAccountId == id);
                if (entity == null)
                {
                    response.Success = false;
                    response.Message = "Money account not found";
                    return response;
                }

                // Validate that kind_lookup_id exists
                var lookupExists = await _db.Lookups.AnyAsync(l => l.LookUpId == request.KindLookupId);
                if (!lookupExists)
                {
                    response.Success = false;
                    response.Message = "Invalid kind lookup ID";
                    return response;
                }

                // Handle default account logic
                if (request.IsDefault && !entity.IsDefault)
                {
                    await RemoveExistingDefaultAsync();
                }

                // Parse meta JSON if provided
                if (!string.IsNullOrWhiteSpace(request.MetaJson))
                {
                    try
                    {
                        entity.Meta = JsonDocument.Parse(request.MetaJson).RootElement;
                    }
                    catch
                    {
                        response.Success = false;
                        response.Message = "Invalid meta JSON format";
                        return response;
                    }
                }

                // Update fields
                entity.AccountCode = request.AccountCode?.Trim();
                entity.Name = request.Name.Trim();
                entity.KindLookupId = request.KindLookupId;
                entity.AccountHolder = request.AccountHolder?.Trim();
                entity.CompanyRegNo = request.CompanyRegNo?.Trim();
                entity.BankName = request.BankName?.Trim();
                entity.BranchName = request.BranchName?.Trim();
                entity.BranchCode = request.BranchCode?.Trim();
                entity.AccountNumber = request.AccountNumber?.Trim();
                entity.Iban = request.Iban?.Trim();
                entity.SwiftBic = request.SwiftBic?.Trim();
                entity.WalletProvider = request.WalletProvider?.Trim();
                entity.WalletPhone = request.WalletPhone?.Trim();
                entity.Currency = request.Currency ?? "PKR";
                entity.OpeningBalance = request.OpeningBalance;
                entity.OpeningBalanceAsOf = request.OpeningBalanceAsOf;
                entity.IsDefault = request.IsDefault;
                entity.IsActive = request.IsActive;
                entity.Notes = request.Notes?.Trim();
                entity.UpdatedAt = DateTime.UtcNow;
                entity.UpdatedBy = updatedBy;

                await _db.SaveChangesAsync();

                // Get the updated entry with lookup details
                var updatedEntry = await GetByIdAsync(id);
                response.Result = updatedEntry.Result;
                response.Success = true;
                response.Message = "Money account updated successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id, string? deletedBy)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var entity = await _db.MoneyAccounts.FirstOrDefaultAsync(m => m.MoneyAccountId == id);
                if (entity == null)
                {
                    response.Success = false;
                    response.Message = "Money account not found";
                    return response;
                }

                // Soft delete - set is_active to false
                entity.IsActive = false;
                entity.UpdatedAt = DateTime.UtcNow;
                entity.UpdatedBy = deletedBy;

                // If this was the default account, remove default status
                if (entity.IsDefault)
                {
                    entity.IsDefault = false;
                }

                await _db.SaveChangesAsync();

                response.Result = true;
                response.Success = true;
                response.Message = "Money account deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<MoneyAccountDto>> GetByIdAsync(int id)
        {
            var response = new ServiceResponse<MoneyAccountDto>();
            try
            {
                var entity = await _db.MoneyAccounts
                    .Include(m => m.KindLookup)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(m => m.MoneyAccountId == id);

                if (entity == null)
                {
                    response.Success = false;
                    response.Message = "Money account not found";
                    return response;
                }

                response.Result = MapToDto(entity);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<MoneyAccountListResponse>> GetAllAsync(
            int page = 1, 
            int pageSize = 20, 
            int? kindLookupId = null, 
            bool? isActive = null)
        {
            var response = new ServiceResponse<MoneyAccountListResponse>();
            try
            {
                page = page <= 0 ? 1 : page;
                pageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);

                var query = _db.MoneyAccounts
                    .Include(m => m.KindLookup)
                    .AsNoTracking()
                    .AsQueryable();

                // Apply filters
                if (kindLookupId.HasValue)
                {
                    query = query.Where(m => m.KindLookupId == kindLookupId.Value);
                }

                if (isActive.HasValue)
                {
                    query = query.Where(m => m.IsActive == isActive.Value);
                }

                var total = await query.CountAsync();
                var entities = await query
                    .OrderByDescending(m => m.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var items = entities.Select(MapToDto).ToList();

                response.Result = new MoneyAccountListResponse
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

        public async Task<ServiceResponse<bool>> SetDefaultAsync(int id, string? updatedBy)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var entity = await _db.MoneyAccounts.FirstOrDefaultAsync(m => m.MoneyAccountId == id);
                if (entity == null)
                {
                    response.Success = false;
                    response.Message = "Money account not found";
                    return response;
                }

                if (!entity.IsActive)
                {
                    response.Success = false;
                    response.Message = "Cannot set inactive account as default";
                    return response;
                }

                // Remove existing default
                await RemoveExistingDefaultAsync();

                // Set new default
                entity.IsDefault = true;
                entity.UpdatedAt = DateTime.UtcNow;
                entity.UpdatedBy = updatedBy;

                await _db.SaveChangesAsync();

                response.Result = true;
                response.Success = true;
                response.Message = "Default account set successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<MoneyAccountDto?>> GetDefaultAccountAsync()
        {
            var response = new ServiceResponse<MoneyAccountDto?>();
            try
            {
                var entity = await _db.MoneyAccounts
                    .Include(m => m.KindLookup)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(m => m.IsDefault && m.IsActive);

                response.Result = entity != null ? MapToDto(entity) : null;
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<List<MoneyAccountDto>>> GetMoneyAccountsByKindLookupIdAsync(int kindLookupId)
        {
            var response = new ServiceResponse<List<MoneyAccountDto>>();
            try
            {
                var entities = await _db.MoneyAccounts
                    .Include(m => m.KindLookup)
                    .AsNoTracking()
                    .Where(m => m.KindLookupId == kindLookupId && m.IsActive)
                    .OrderBy(m => m.Name)
                    .ToListAsync();

                if (!entities.Any())
                {
                    response.Success = false;
                    response.Message = $"No active money accounts found for kind lookup ID: {kindLookupId}";
                    response.Result = new List<MoneyAccountDto>();
                    return response;
                }

                var items = entities.Select(MapToDto).ToList();
                response.Result = items;
                response.Success = true;
                response.Message = $"Found {items.Count} active money account(s) for kind lookup ID: {kindLookupId}";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Result = new List<MoneyAccountDto>();
            }
            return response;
        }

        private async Task RemoveExistingDefaultAsync()
        {
            var existingDefault = await _db.MoneyAccounts
                .Where(m => m.IsDefault && m.IsActive)
                .ToListAsync();

            foreach (var account in existingDefault)
            {
                account.IsDefault = false;
                account.UpdatedAt = DateTime.UtcNow;
            }
        }

        private static MoneyAccountDto MapToDto(MoneyAccount entity)
        {
            return new MoneyAccountDto
            {
                MoneyAccountId = entity.MoneyAccountId,
                AccountCode = entity.AccountCode,
                Name = entity.Name,
                KindLookupId = entity.KindLookupId,
                KindLookupName = entity.KindLookup?.LookUpName,
                AccountHolder = entity.AccountHolder,
                CompanyRegNo = entity.CompanyRegNo,
                BankName = entity.BankName,
                BranchName = entity.BranchName,
                BranchCode = entity.BranchCode,
                AccountNumber = entity.AccountNumber,
                Iban = entity.Iban,
                SwiftBic = entity.SwiftBic,
                WalletProvider = entity.WalletProvider,
                WalletPhone = entity.WalletPhone,
                Currency = entity.Currency,
                OpeningBalance = entity.OpeningBalance,
                OpeningBalanceAsOf = entity.OpeningBalanceAsOf,
                IsDefault = entity.IsDefault,
                IsActive = entity.IsActive,
                Notes = entity.Notes,
                Meta = entity.Meta?.ToString(),
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                CreatedBy = entity.CreatedBy,
                UpdatedBy = entity.UpdatedBy
            };
        }
    }
}
