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
    }
}