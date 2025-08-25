using Biomass.Server.Models.Lookup;

namespace Biomass.Server.Interfaces
{
    public interface ILookupService
    {
        Task<List<Lookup>> GetAllLookupsAsync();
        Task<List<Lookup>> GetLookupsByDomainAsync(string domain);
        Task<Lookup> CreateLookupAsync(Lookup lookup);
        Task<Lookup> UpdateLookupAsync(int id, Lookup lookup);
        Task<bool> DeleteLookupAsync(int id);
    }
}