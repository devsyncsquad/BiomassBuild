using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Lookup;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Repository
{
    public class LookupRepository : ILookupRepository
    {
        private readonly ApplicationDbContext _context;
        public LookupRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //public async Task<(IEnumerable<Lookup> Items, int TotalCount)> GetAsync(string? domain, int page, int pageSize)
        //{
        //    var query = _context.Lookups.AsQueryable();
        //    if (!string.IsNullOrWhiteSpace(domain))
        //    {
        //        query = query.Where(l => l.LookUpDomain == domain);
        //    }
        //    var total = await query.CountAsync();
        //    var items = await query
        //        .OrderByDescending(l => l.CreatedOn)
        //        .Skip((page - 1) * pageSize)
        //        .Take(pageSize)
        //        .ToListAsync();
        //    return (items, total);
        //}

        public async Task<(IEnumerable<Lookup> Items, int TotalCount)> GetAsync(string? domain, int page, int pageSize)
        {
            var query = _context.Lookups.AsQueryable();

            if (!string.IsNullOrWhiteSpace(domain))
            {
                query = query.Where(l => l.LookUpDomain == domain);
            }

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(l => l.CreatedOn)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }


        public Task<Lookup?> GetByIdAsync(int id)
        {
            return _context.Lookups.FirstOrDefaultAsync(x => x.LookUpId == id);
        }

        public async Task<Lookup> CreateAsync(Lookup lookup)
        {
            _context.Lookups.Add(lookup);
            await _context.SaveChangesAsync();
            return lookup;
        }

        public async Task<Lookup?> UpdateAsync(Lookup lookup)
        {
            var existing = await _context.Lookups.FirstOrDefaultAsync(x => x.LookUpId == lookup.LookUpId);
            if (existing == null) return null;
            existing.LookUpName = lookup.LookUpName;
            existing.LookUpDomain = lookup.LookUpDomain;
            existing.Enabled = lookup.Enabled;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Lookups.FirstOrDefaultAsync(x => x.LookUpId == id);
            if (existing == null) return false;
            _context.Lookups.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}


