using Biomass.Server.Models.Lookup;

namespace Biomass.Server.Interfaces
{
    public interface ILookupRepository
    {
        Task<(IEnumerable<Lookup> Items, int TotalCount)> GetAsync(string? domain, int page, int pageSize);
        Task<Lookup?> GetByIdAsync(int id);
        Task<Lookup> CreateAsync(Lookup lookup);
        Task<Lookup?> UpdateAsync(Lookup lookup);
        Task<bool> DeleteAsync(int id);
    }
}


