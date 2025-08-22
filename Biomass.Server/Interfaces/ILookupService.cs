using Biomass.Api.Model;
using Biomass.Server.Models.Lookup;

namespace Biomass.Server.Interfaces
{
    public interface ILookupService
    {
        Task<ServiceResponse<(IEnumerable<LookupDto> Items, int TotalCount)>> GetAsync(string? domain, string? status, string? search, int page, int pageSize);
        Task<ServiceResponse<IEnumerable<LookupDto>>> GetAllUnpaginatedAsync(string? domain, string? status, string? search);
        Task<ServiceResponse<LookupDto>> GetByIdAsync(int id);
        Task<ServiceResponse<LookupDto>> CreateAsync(CreateLookupRequest request);
        Task<ServiceResponse<LookupDto>> UpdateAsync(UpdateLookupRequest request);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
        Task<ServiceResponse<LookupStatistics>> GetStatisticsAsync();
        Task<ServiceResponse<List<string>>> GetDomainsAsync();
        Task<ServiceResponse<Dictionary<string, List<LookupDto>>>> GetLookupsByDomainsAsync();
    }
}


