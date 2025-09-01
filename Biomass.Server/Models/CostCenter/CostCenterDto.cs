namespace Biomass.Server.Models.CostCenter
{
    public class CostCenterDto
    {
        public int CostCenterId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public int? ParentCostCenterId { get; set; }
        public int? CompanyId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<CostCenterDto> Children { get; set; } = new List<CostCenterDto>();
    }
}
