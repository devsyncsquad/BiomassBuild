using Biomass.Server.Models.CostCenter;

namespace Biomass.Server.Interfaces
{
    public interface IUserCostCenterService
    {
        Task<UserCostCenterAssignmentDto> GetUserCostCenterAssignmentAsync(int userId);
        Task<UserCostCenterDto> AssignCostCenterToUserAsync(AssignCostCenterRequest request);
        Task<List<UserCostCenterDto>> GetUserCostCentersAsync(int userId);
        Task<bool> RemoveCostCenterFromUserAsync(int userId, int costCenterId);
        Task<bool> UnassignCostCenterFromUserAsync(int userId, int costCenterId);
    }
}
