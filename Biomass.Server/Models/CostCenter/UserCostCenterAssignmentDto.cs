namespace Biomass.Server.Models.CostCenter
{
    public class UserCostCenterAssignmentDto
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public List<UserCostCenterDto> AssignedCostCenters { get; set; } = new List<UserCostCenterDto>();
        public List<CostCenterDto> AvailableCostCenters { get; set; } = new List<CostCenterDto>();
    }
}
