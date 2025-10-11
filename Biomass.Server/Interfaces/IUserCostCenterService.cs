using Biomass.Server.Models.UserManagement;

namespace Biomass.Server.Interfaces
{
    public interface IUserCostCenterService
    {

        Task<UserCostCenterAssignmentDto> GetUserCostCenterAssignmentAsync(int userId);
        Task<UserCostCenterDto> AssignCostCenterToUserAsync(AssignCostCenterRequest request);
        Task<List<UserCostCenterDto>> GetUserCostCentersAsync(int userId);
        Task<bool> RemoveCostCenterFromUserAsync(int userId, int costCenterId);
        Task<bool> UnassignCostCenterFromUserAsync(int userId, int costCenterId);
        Task<List<UserCostCenterDto>> GetAllUserCostCentersAsync();
        Task<bool> IsCostCenterAssignedToUserAsync(int userId, int costCenterId);
    }
}
