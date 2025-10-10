using Biomass.Server.Models.UserManagement;

namespace Biomass.Server.Interfaces
{
    public interface IUserCostCenterService
    {
        Task<List<UserCostCenterDto>> GetUserCostCentersAsync(int userId);
        Task<UserCostCenterAssignmentDto> GetUserCostCenterAssignmentAsync(int userId);
        Task<UserCostCenterDto> AssignCostCenterToUserAsync(AssignCostCenterRequest request);
        Task<bool> UnassignCostCenterFromUserAsync(int userId, int costCenterId);
        Task<List<UserCostCenterDto>> GetAllUserCostCentersAsync();
        Task<bool> IsCostCenterAssignedToUserAsync(int userId, int costCenterId);
    }
}
