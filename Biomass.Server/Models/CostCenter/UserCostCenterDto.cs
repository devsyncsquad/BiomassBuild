namespace Biomass.Server.Models.CostCenter
{
    public class UserCostCenterDto
    {
        public int UserId { get; set; }
        public int CostCenterId { get; set; }
        public bool CanPost { get; set; }
        public string? Username { get; set; }
        public string? CostCenterName { get; set; }
        public string? CostCenterCode { get; set; }
        public bool IsActive { get; set; }
    }
}
