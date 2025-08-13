using Biomass.Api.Model;
using Biomass.Server.Models.Lookup;

namespace Biomass.Server.Interfaces
{
    public class LookupDto
    {
        public int LookUpId { get; set; }
        public string LookUpName { get; set; } = string.Empty;
        public string? LookUpDomain { get; set; }
        public string? Enabled { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class CreateLookupRequest
    {
        public string LookUpName { get; set; } = string.Empty;
        public string? LookUpDomain { get; set; }
        public string? Enabled { get; set; } = "Y";
    }

    public class UpdateLookupRequest
    {
        public int LookUpId { get; set; }
        public string LookUpName { get; set; } = string.Empty;
        public string? LookUpDomain { get; set; }
        public string? Enabled { get; set; }
    }

    public interface ILookupService
    {
        Task<ServiceResponse<(IEnumerable<LookupDto> Items, int TotalCount)>> GetAsync(string? domain, int page, int pageSize);
        Task<ServiceResponse<LookupDto>> GetByIdAsync(int id);
        Task<ServiceResponse<LookupDto>> CreateAsync(CreateLookupRequest request, string? createdBy);
        Task<ServiceResponse<LookupDto>> UpdateAsync(UpdateLookupRequest request);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}


