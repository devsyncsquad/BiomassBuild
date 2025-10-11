namespace Biomass.Server.Models.CostCenter
{
    public class AssignCostCenterRequest
    {
        public int UserId { get; set; }
        public int CostCenterId { get; set; }
        public bool CanPost { get; set; }
    }
}
