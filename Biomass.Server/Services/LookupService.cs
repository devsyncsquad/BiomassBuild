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

        public async Task<ServiceResponse<(IEnumerable<Lookup> Items, int TotalCount)>> GetAsync(string? domain, int page, int pageSize)
        {
            var response = new ServiceResponse<(IEnumerable<Lookup> Items, int TotalCount)>();

            try
            {
                page = page <= 0 ? 1 : page;
                pageSize = pageSize <= 0 ? 10 : pageSize;

                var query = _dbContext.Lookups.AsNoTracking().AsQueryable();
                if (!string.IsNullOrWhiteSpace(domain))
                {
                    query = query.Where(l => l.LookUpDomain == domain);
                }

                var total = await query.CountAsync();
                var items = await query
                    .OrderBy(l => l.LookUpId)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                response.Result = (items, total);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }
        //public async Task<ServiceResponse<(IEnumerable<LookupDto> Items, int TotalCount)>> GetAsync(string? domain, int page, int pageSize)
        //{
        //    var response = new ServiceResponse<(IEnumerable<LookupDto>, int)>();
        //    try
        //    {
        //        page = page <= 0 ? 1 : page;
        //        pageSize = pageSize <= 0 ? 10 : pageSize;
        //        var (items, total) = await _repo.GetAsync(domain, page, pageSize);
        //        response.Result = (items.Select(Map).ToList(), total);
        //        response.Success = true;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = ex.Message;
        //    }
        //    return response;
        //}

        public async Task<ServiceResponse<LookupDto>> GetByIdAsync(int id)
        {
            var response = new ServiceResponse<LookupDto>();
            try
            {
                var entity = await _dbContext.Lookups.AsNoTracking().FirstOrDefaultAsync(l => l.LookUpId == id);
                if (entity == null)
                {
                    response.Success = false;
                    response.Message = "Not found";
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

        public async Task<ServiceResponse<LookupDto>> CreateAsync(Lookup request)
        {
            var response = new ServiceResponse<LookupDto>();
            try
            {
                if (string.IsNullOrWhiteSpace(request.LookUpName))
                {
                    response.Success = false;
                    response.Message = "Name is required";
                    return response;
                }
                var entity = new Lookup
                {
                    LookUpName = request.LookUpName.Trim(),
                    LookUpDomain = request.LookUpDomain?.Trim(),
                    Enabled = request.Enabled,
                    CreatedBy = request.CreatedBy,
                    CreatedOn = DateTime.UtcNow
                };
                _dbContext.Lookups.Add(entity);
                await _dbContext.SaveChangesAsync();
                response.Result = Map(entity);
                response.Success = true;
                response.Message = "Created";
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
                if (string.IsNullOrWhiteSpace(request.LookUpName))
                {
                    response.Success = false;
                    response.Message = "Name is required";
                    return response;
                }
                var entity = await _dbContext.Lookups.FirstOrDefaultAsync(l => l.LookUpId == request.LookUpId);
                if (entity == null)
                {
                    response.Success = false;
                    response.Message = "Not found";
                    return response;
                }
                entity.LookUpName = request.LookUpName.Trim();
                entity.LookUpDomain = request.LookUpDomain?.Trim();
                entity.Enabled = request.Enabled;
                await _dbContext.SaveChangesAsync();
                response.Result = Map(entity);
                response.Success = true;
                response.Message = "Updated";
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
                var entity = await _dbContext.Lookups.FirstOrDefaultAsync(l => l.LookUpId == id);
                if (entity == null)
                {
                    response.Result = false;
                    response.Success = false;
                    response.Message = "Not found";
                    return response;
                }
                _dbContext.Lookups.Remove(entity);
                await _dbContext.SaveChangesAsync();
                response.Result = true;
                response.Success = true;
                response.Message = "Deleted";
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
                    .GroupBy(l => l.LookUpDomain ?? "Unknown")
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
            LookUpId = l.LookUpId,
            LookUpName = l.LookUpName,
            LookUpDomain = l.LookUpDomain,
            Enabled = l.Enabled,
            Created_at = l.CreatedOn
        };
    }
}


