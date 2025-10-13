using Biomass.Server.Models.UserManagement;

namespace Biomass.Server.Models.CostCenter
{
    public class UserCostCenterAssignmentDto
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public List<UserManagement.UserCostCenterDto> AssignedCostCenters { get; set; } = new List<UserManagement.UserCostCenterDto>();
        public List<CostCenterDto> AvailableCostCenters { get; set; } = new List<CostCenterDto>();
    }
}

