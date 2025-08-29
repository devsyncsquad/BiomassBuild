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
        public int Created_by { get; set; }
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
        Task<List<Lookup>> GetAllLookupsAsync();
        Task<List<Lookup>> GetLookupsByDomainAsync(string domain);
        Task<Lookup> CreateLookupAsync(Lookup lookup);
        Task<Lookup> UpdateLookupAsync(int id, Lookup lookup);
        Task<bool> DeleteLookupAsync(int id);
    }
}