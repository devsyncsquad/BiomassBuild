using Biomass.Api.Model;
using Biomass.Server.Models.Lookup;

namespace Biomass.Server.Interfaces
{
    public class LookupDto
    {
        public int LookUpId { get; set; }
        public string LookUpName { get; set; } = string.Empty;
        public string? LookUpDomain { get; set; }
        public bool? Enabled { get; set; }
        public DateTime Created_at { get; set; }
    }

    public class CreateLookupRequest
    {
        public string LookUpName { get; set; } = string.Empty;
        public string? LookUpDomain { get; set; }
        public bool? Enabled { get; set; } 
    }

    public class UpdateLookupRequest
    {
        public int LookUpId { get; set; }
        public string LookUpName { get; set; } = string.Empty;
        public string? LookUpDomain { get; set; }
        public bool? Enabled { get; set; }
    }

    public interface ILookupService
    {
        Task<ServiceResponse<(IEnumerable<Lookup> Items, int TotalCount)>> GetAsync(string? domain, int page, int pageSize);
        Task<ServiceResponse<LookupDto>> GetByIdAsync(int id);
        Task<ServiceResponse<LookupDto>> CreateAsync(Lookup request);
        Task<ServiceResponse<LookupDto>> UpdateAsync(UpdateLookupRequest request);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
        Task<ServiceResponse<Dictionary<string, List<LookupDto>>>> GetLookupsByDomainsAsync();
    }
}


