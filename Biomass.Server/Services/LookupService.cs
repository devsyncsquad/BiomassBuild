using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Lookup;
using Biomass.Server.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Biomass.Server.Services
{
    public class LookupService : ILookupService
    {
        private readonly ApplicationDbContext _dbContext;
        public LookupService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ServiceResponse<(IEnumerable<LookupDto> Items, int TotalCount)>> GetAsync(string? domain, string? status, string? search, int page, int pageSize)
        {
            var response = new ServiceResponse<(IEnumerable<LookupDto> Items, int TotalCount)>();
            try
            {
                page = page <= 0 ? 1 : page;
                pageSize = pageSize <= 0 ? 10 : pageSize;
                var query = _dbContext.Lookups.AsNoTracking().AsQueryable();
                if (!string.IsNullOrWhiteSpace(domain)) { query = query.Where(l => l.LookupDomain == domain); }
                if (!string.IsNullOrWhiteSpace(status))
                {
                    switch (status.ToLower())
                    {
                        case "enabled": query = query.Where(l => l.Enabled); break;
                        case "disabled": query = query.Where(l => !l.Enabled); break;
                        case "pending": query = query.Where(l => l.SortOrder > 0 && !l.Enabled); break;
                    }
                }
                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(l => 
                        l.LookupName.Contains(search) || 
                        l.LookupId.ToString().Contains(search) ||
                        l.LookupDomain.Contains(search)
                    );
                }
                var total = await query.CountAsync();
                var items = await query
                    .OrderBy(l => l.SortOrder)
                    .ThenBy(l => l.LookupName)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
                var dtos = items.Select(Map).ToList();
                response.Result = (dtos, total);
                response.Success = true;
            }
            catch (Exception ex) { response.Success = false; response.Message = ex.Message; }
            return response;
        }

        public async Task<ServiceResponse<IEnumerable<LookupDto>>> GetAllUnpaginatedAsync(string? domain, string? status, string? search)
        {
            var response = new ServiceResponse<IEnumerable<LookupDto>>();
            try
            {
                var query = _dbContext.Lookups.AsNoTracking().AsQueryable();
                if (!string.IsNullOrWhiteSpace(domain)) { query = query.Where(l => l.LookupDomain == domain); }
                if (!string.IsNullOrWhiteSpace(status))
                {
                    switch (status.ToLower())
                    {
                        case "enabled": query = query.Where(l => l.Enabled); break;
                        case "disabled": query = query.Where(l => !l.Enabled); break;
                        case "pending": query = query.Where(l => l.SortOrder > 0 && !l.Enabled); break;
                    }
                }
                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(l => 
                        l.LookupName.Contains(search) || 
                        l.LookupId.ToString().Contains(search) ||
                        l.LookupDomain.Contains(search)
                    );
                }
                var items = await query
                    .OrderBy(l => l.SortOrder)
                    .ThenBy(l => l.LookupName)
                    .ToListAsync();
                var dtos = items.Select(Map).ToList();
                response.Result = dtos;
                response.Success = true;
            }
            catch (Exception ex) { response.Success = false; response.Message = ex.Message; }
            return response;
        }

        public async Task<ServiceResponse<LookupDto>> GetByIdAsync(int id)
        {
            var response = new ServiceResponse<LookupDto>();
            try
            {
                var entity = await _dbContext.Lookups.AsNoTracking().FirstOrDefaultAsync(l => l.LookupId == id);
                if (entity == null)
                {
                    response.Success = false;
                    response.Message = "Lookup not found";
                    return response;
                }
                response.Result = Map(entity);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<LookupDto>> CreateAsync(CreateLookupRequest request)
        {
            var response = new ServiceResponse<LookupDto>();
            try
            {
                // Check for uniqueness constraint
                var existingLookup = await _dbContext.Lookups
                    .FirstOrDefaultAsync(l => 
                        l.LookupName.ToLower() == request.LookupName.ToLower() && 
                        l.LookupDomain.ToLower() == request.LookupDomain.ToLower());

                if (existingLookup != null)
                {
                    response.Success = false;
                    response.Message = $"A lookup with name '{request.LookupName}' already exists in domain '{request.LookupDomain}'";
                    return response;
                }

                var entity = new Lookup
                {
                    LookupName = request.LookupName.Trim(),
                    LookupDomain = request.LookupDomain.Trim(),
                    Enabled = request.Enabled,
                    SortOrder = request.SortOrder,
                    CreatedBy = 1, // TODO: Get from current user context
                    CreatedOn = DateTime.UtcNow
                };

                _dbContext.Lookups.Add(entity);
                await _dbContext.SaveChangesAsync();
                
                response.Result = Map(entity);
                response.Success = true;
                response.Message = "Lookup created successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<LookupDto>> UpdateAsync(UpdateLookupRequest request)
        {
            var response = new ServiceResponse<LookupDto>();
            try
            {
                var entity = await _dbContext.Lookups.FirstOrDefaultAsync(l => l.LookupId == request.LookupId);
                if (entity == null)
                {
                    response.Success = false;
                    response.Message = "Lookup not found";
                    return response;
                }

                // Check for uniqueness constraint (excluding current record)
                var existingLookup = await _dbContext.Lookups
                    .FirstOrDefaultAsync(l => 
                        l.LookupId != request.LookupId &&
                        l.LookupName.ToLower() == request.LookupName.ToLower() && 
                        l.LookupDomain.ToLower() == request.LookupDomain.ToLower());

                if (existingLookup != null)
                {
                    response.Success = false;
                    response.Message = $"A lookup with name '{request.LookupName}' already exists in domain '{request.LookupDomain}'";
                    return response;
                }

                entity.LookupName = request.LookupName.Trim();
                entity.LookupDomain = request.LookupDomain.Trim();
                entity.Enabled = request.Enabled;
                entity.SortOrder = request.SortOrder;

                await _dbContext.SaveChangesAsync();
                
                response.Result = Map(entity);
                response.Success = true;
                response.Message = "Lookup updated successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var entity = await _dbContext.Lookups.FirstOrDefaultAsync(l => l.LookupId == id);
                if (entity == null)
                {
                    response.Result = false;
                    response.Success = false;
                    response.Message = "Lookup not found";
                    return response;
                }

                _dbContext.Lookups.Remove(entity);
                await _dbContext.SaveChangesAsync();
                
                response.Result = true;
                response.Success = true;
                response.Message = "Lookup deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<LookupStatistics>> GetStatisticsAsync()
        {
            var response = new ServiceResponse<LookupStatistics>();
            try
            {
                var total = await _dbContext.Lookups.CountAsync();
                var enabled = await _dbContext.Lookups.CountAsync(l => l.Enabled);
                var disabled = await _dbContext.Lookups.CountAsync(l => !l.Enabled);
                var pending = await _dbContext.Lookups.CountAsync(l => l.SortOrder > 0 && !l.Enabled);

                response.Result = new LookupStatistics
                {
                    Total = total,
                    Enabled = enabled,
                    Disabled = disabled,
                    Pending = pending
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

        public async Task<ServiceResponse<List<string>>> GetDomainsAsync()
        {
            var response = new ServiceResponse<List<string>>();
            try
            {
                var domains = await _dbContext.Lookups
                    .AsNoTracking()
                    .Select(l => l.LookupDomain)
                    .Distinct()
                    .OrderBy(d => d)
                    .ToListAsync();

                response.Result = domains;
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<Dictionary<string, List<LookupDto>>>> GetLookupsByDomainsAsync()
        {
            var response = new ServiceResponse<Dictionary<string, List<LookupDto>>>();
            try
            {
                var allItems = await _dbContext.Lookups.AsNoTracking().ToListAsync();
                var result = allItems
                    .GroupBy(l => l.LookupDomain ?? "Unknown")
                    .ToDictionary(
                        group => group.Key,
                        group => group.Select(Map).ToList()
                    );
                
                response.Result = result;
                response.Success = true;
                response.Message = "All lookups retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        private static LookupDto Map(Lookup l) => new LookupDto
        {
            LookupId = l.LookupId,
            LookupName = l.LookupName,
            LookupDomain = l.LookupDomain,
            Enabled = l.Enabled,
            SortOrder = l.SortOrder,
            CreatedOn = l.CreatedOn,
            CreatedBy = l.CreatedBy,
            Status = l.Enabled ? "Enabled" : "Disabled"
        };
    }
}


