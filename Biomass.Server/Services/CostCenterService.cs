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

        public async Task<List<CostCenterViewDto>> GetAllCostCentersViewAsync()
        {
            try
            {
                var costCenters = await _context.CostCenters
                    .Include(cc => cc.Parent)
                    .OrderBy(cc => cc.Code)
                    .ToListAsync();

                // Debug: Check if parent relationships are loaded
                var costCentersWithParents = costCenters.Where(cc => cc.ParentCostCenterId.HasValue).ToList();
                foreach (var cc in costCentersWithParents)
                {
                    Console.WriteLine($"Cost Center {cc.Code} has ParentCostCenterId: {cc.ParentCostCenterId}, Parent loaded: {cc.Parent != null}");
                    if (cc.Parent != null)
                    {
                        Console.WriteLine($"Parent details - Code: {cc.Parent.Code}, Name: {cc.Parent.Name}");
                    }
                }

                return costCenters.Select(MapToViewDto).ToList();
            }
            catch (Exception ex)
            {
                // Log the exception if you have logging configured
                throw;
            }
        }

        public async Task<List<CostCenterDto>> GetUserActiveParentCostCentersAsync(int userId, int? companyId = null)
        {
            var response = new List<CostCenterDto>();
            try
            {
                // Get user cost centers from the view with can_post = true
                var userCostCenters = await _context.VUserCostCenters.AsNoTracking()
                    .Where(v => v.UserId == userId && v.CanPost)
                    .Where(v => !companyId.HasValue || v.CostCenterId == companyId) // Note: This might need adjustment based on your view structure
                    .OrderBy(v => v.CostCenterName)
                    .ToListAsync();

                // Create lookup dictionaries for efficient processing
                var costCenterLookup = userCostCenters.ToDictionary(c => c.CostCenterId);
                var dtoLookup = userCostCenters.ToDictionary(c => c.CostCenterId, c => new CostCenterDto
                {
                    CostCenterId = c.CostCenterId,
                    Code = "", // Not available in view, will be empty
                    Name = c.CostCenterName,
                    IsActive = c.IsActive,
                    ParentCostCenterId = c.ParentCostCenterId,
                    CompanyId = companyId,
                    CreatedAt = null // Not available in view
                });

                // Build the hierarchy
                foreach (var userCostCenter in userCostCenters)
                {
                    if (userCostCenter.ParentCostCenterId.HasValue && dtoLookup.ContainsKey(userCostCenter.ParentCostCenterId.Value))
                    {
                        dtoLookup[userCostCenter.ParentCostCenterId.Value].Children.Add(dtoLookup[userCostCenter.CostCenterId]);
                    }
                }

                // Get only active parent cost centers (those without parents)
                var parentCostCenters = userCostCenters
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

            return response; // Ensure a return statement is present in all code paths
        }

        private static CostCenterViewDto MapToViewDto(CostCenter costCenter)
        {
            return new CostCenterViewDto
            {
                CostCenterId = costCenter.CostCenterId,
                Code = costCenter.Code,
                Name = costCenter.Name,
                IsActive = costCenter.IsActive,
                ParentCostCenterId = costCenter.ParentCostCenterId,
                CompanyId = costCenter.CompanyId,
                CreatedAt = costCenter.CreatedAt,
                CostCenterType = costCenter.ParentCostCenterId == null ? "Parent" : "Child",
                ParentId = costCenter.Parent?.CostCenterId,
                ParentCode = costCenter.Parent?.Code ?? string.Empty,
                ParentName = costCenter.Parent?.Name ?? string.Empty,
                ParentIsActive = costCenter.Parent?.IsActive,
                Children = new List<CostCenterViewDto>()
            };
        }
    }
}