using Biomass.Server.Models.CostCenter;

namespace Biomass.Server.Interfaces
{
    public interface ICostCenterService
    {
        Task<List<CostCenterDto>> GetAllCostCentersAsync();
        Task<List<CostCenterDto>> GetActiveCostCentersAsync();
        Task<CostCenterDto?> GetCostCenterByIdAsync(int id);
        Task<CostCenterDto> CreateCostCenterAsync(CostCenter costCenter);
        Task<CostCenterDto?> UpdateCostCenterAsync(int id, CostCenter costCenter);
        Task<bool> DeleteCostCenterAsync(int id);
        Task<List<CostCenterDto>> GetActiveParentCostCentersAsync(int? companyId = null);
        Task<List<CostCenterDto>> GetUserActiveParentCostCentersAsync(int userId, int? companyId = null);
    }
}