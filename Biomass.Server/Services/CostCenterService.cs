using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.CostCenter;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
    public class CostCenterService : ICostCenterService
    {
        private readonly ApplicationDbContext _context;

        public CostCenterService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CostCenterDto>> GetAllCostCentersAsync()
        {
            var costCenters = await _context.CostCenters
                .OrderBy(cc => cc.Code)
                .ToListAsync();

            return costCenters.Select(MapToDto).ToList();
        }

        public async Task<List<CostCenterDto>> GetActiveCostCentersAsync()
        {
            var costCenters = await _context.CostCenters
                .Where(cc => cc.IsActive)
                .OrderBy(cc => cc.Code)
                .ToListAsync();

            return costCenters.Select(MapToDto).ToList();
        }

        public async Task<CostCenterDto?> GetCostCenterByIdAsync(int id)
        {
            var costCenter = await _context.CostCenters.FindAsync(id);
            return costCenter != null ? MapToDto(costCenter) : null;
        }

        public async Task<CostCenterDto> CreateCostCenterAsync(CostCenter costCenter)
        {
            _context.CostCenters.Add(costCenter);
            await _context.SaveChangesAsync();
            return MapToDto(costCenter);
        }

        public async Task<CostCenterDto?> UpdateCostCenterAsync(int id, CostCenter costCenter)
        {
            var existingCostCenter = await _context.CostCenters.FindAsync(id);
            if (existingCostCenter == null)
                return null;

            existingCostCenter.Code = costCenter.Code;
            existingCostCenter.Name = costCenter.Name;
            existingCostCenter.IsActive = costCenter.IsActive;
            existingCostCenter.ParentCostCenterId = costCenter.ParentCostCenterId;
            existingCostCenter.CompanyId = costCenter.CompanyId;

            await _context.SaveChangesAsync();
            return MapToDto(existingCostCenter);
        }

        public async Task<bool> DeleteCostCenterAsync(int id)
        {
            var costCenter = await _context.CostCenters.FindAsync(id);
            if (costCenter == null)
                return false;

            _context.CostCenters.Remove(costCenter);
            await _context.SaveChangesAsync();
            return true;
        }

        private static CostCenterDto MapToDto(CostCenter costCenter)
        {
            return new CostCenterDto
            {
                CostCenterId = costCenter.CostCenterId,
                Code = costCenter.Code,
                Name = costCenter.Name,
                IsActive = costCenter.IsActive,
                ParentCostCenterId = costCenter.ParentCostCenterId,
                CompanyId = costCenter.CompanyId,
                CreatedAt = costCenter.CreatedAt
            };
        }

        public async Task<List<CostCenterDto>> GetActiveParentCostCentersAsync(int? companyId = null)
        {
            var response = new List<CostCenterDto>();
            try
            {
                // Get all cost centers for the company (or all if no company specified)
                var allCostCenters = await _context.CostCenters.AsNoTracking()
                    .Where(c => !companyId.HasValue || c.CompanyId == companyId)
                    .OrderBy(c => c.Name)
                    .ToListAsync();

                // Create lookup dictionaries for efficient processing
                var costCenterLookup = allCostCenters.ToDictionary(c => c.CostCenterId);
                var dtoLookup = allCostCenters.ToDictionary(c => c.CostCenterId, c => MapToDto(c));

                // Build the hierarchy
                foreach (var costCenter in allCostCenters)
                {
                    if (costCenter.ParentCostCenterId.HasValue && dtoLookup.ContainsKey(costCenter.ParentCostCenterId.Value))
                    {
                        dtoLookup[costCenter.ParentCostCenterId.Value].Children.Add(dtoLookup[costCenter.CostCenterId]);
                    }
                }

                // Get only active parent cost centers (those without parents)
                var parentCostCenters = allCostCenters
                    .Where(c => c.ParentCostCenterId == null && c.IsActive)
                    .Select(c => dtoLookup[c.CostCenterId])
                    .ToList();

                response = parentCostCenters;
            }
            catch (Exception ex)
            {
                // Log the exception if you have logging configured
                throw;
            }
            return response;
        }
    }
}