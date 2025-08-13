using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Lookup;

namespace Biomass.Server.Services
{
    public class LookupService : ILookupService
    {
        private readonly ILookupRepository _repo;
        public LookupService(ILookupRepository repo)
        {
            _repo = repo;
        }

        public async Task<ServiceResponse<(IEnumerable<LookupDto> Items, int TotalCount)>> GetAsync(string? domain, int page, int pageSize)
        {
            var response = new ServiceResponse<(IEnumerable<LookupDto>, int)>();
            try
            {
                page = page <= 0 ? 1 : page;
                pageSize = pageSize <= 0 ? 10 : pageSize;
                var (items, total) = await _repo.GetAsync(domain, page, pageSize);
                response.Result = (items.Select(Map).ToList(), total);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<LookupDto>> GetByIdAsync(int id)
        {
            var response = new ServiceResponse<LookupDto>();
            try
            {
                var entity = await _repo.GetByIdAsync(id);
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

        public async Task<ServiceResponse<LookupDto>> CreateAsync(CreateLookupRequest request, string? createdBy)
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
                    Enabled = string.IsNullOrWhiteSpace(request.Enabled) ? "Y" : request.Enabled,
                    CreatedBy = createdBy,
                    CreatedOn = DateTime.UtcNow
                };
                var saved = await _repo.CreateAsync(entity);
                response.Result = Map(saved);
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
                var toUpdate = new Lookup
                {
                    LookUpId = request.LookUpId,
                    LookUpName = request.LookUpName.Trim(),
                    LookUpDomain = request.LookUpDomain?.Trim(),
                    Enabled = request.Enabled
                };
                var updated = await _repo.UpdateAsync(toUpdate);
                if (updated == null)
                {
                    response.Success = false;
                    response.Message = "Not found";
                    return response;
                }
                response.Result = Map(updated);
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
                var ok = await _repo.DeleteAsync(id);
                response.Result = ok;
                response.Success = ok;
                response.Message = ok ? "Deleted" : "Not found";
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
                // Get all lookups without domain filter to get all data
                var (allItems, _) = await _repo.GetAsync(null, 1, int.MaxValue);
                
                // Group by domain
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
            CreatedBy = l.CreatedBy,
            CreatedOn = l.CreatedOn
        };
    }
}


