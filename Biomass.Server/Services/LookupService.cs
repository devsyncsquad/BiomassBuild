using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Lookup;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
    public class LookupService : ILookupService
    {
        private readonly ApplicationDbContext _context;

        public LookupService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Lookup>> GetAllLookupsAsync()
        {
            return await _context.Lookups.ToListAsync();
        }

        public async Task<List<Lookup>> GetLookupsByDomainAsync(string domain)
        {
            return await _context.Lookups
                .Where(l => l.LookupDomain == domain && l.Enabled)
                .OrderBy(l => l.SortOrder)
                .ThenBy(l => l.LookupName)
                .ToListAsync();
        }

        public async Task<Lookup> CreateLookupAsync(Lookup lookup)
        {
            _context.Lookups.Add(lookup);
            await _context.SaveChangesAsync();
            return lookup;
        }

        public async Task<Lookup> UpdateLookupAsync(int id, Lookup lookup)
        {
            var existingLookup = await _context.Lookups.FindAsync(id);
            if (existingLookup == null)
                return null;

            existingLookup.LookupName = lookup.LookupName;
            existingLookup.LookupDomain = lookup.LookupDomain;
            existingLookup.Enabled = lookup.Enabled;
            existingLookup.SortOrder = lookup.SortOrder;

            await _context.SaveChangesAsync();
            return existingLookup;
        }

        public async Task<bool> DeleteLookupAsync(int id)
        {
            var lookup = await _context.Lookups.FindAsync(id);
            if (lookup == null)
                return false;

            _context.Lookups.Remove(lookup);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}