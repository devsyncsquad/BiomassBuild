namespace Biomass.Server.Models.UserManagement
{
    public class UserCostCenterDto
    {
        public int UserId { get; set; }
        public int CostCenterId { get; set; }
        public bool? CanPost { get; set; }
        
        // Additional fields for display
        public string? UserName { get; set; }
        public string? CostCenterName { get; set; }
        public string? CostCenterCode { get; set; }
    }

    public class AssignCostCenterRequest
    {
        public int UserId { get; set; }
        public int CostCenterId { get; set; }
        public int? AssignedBy { get; set; }
    }

    public class UserCostCenterAssignmentDto
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public List<CostCenterAssignmentDto> AssignedCostCenters { get; set; } = new List<CostCenterAssignmentDto>();
        public List<CostCenterAssignmentDto> AvailableCostCenters { get; set; } = new List<CostCenterAssignmentDto>();
    }

    public class CostCenterAssignmentDto
    {
        public int CostCenterId { get; set; }
        public string? CostCenterName { get; set; }
        public string? CostCenterCode { get; set; }
        public bool IsAssigned { get; set; }
    }
}
