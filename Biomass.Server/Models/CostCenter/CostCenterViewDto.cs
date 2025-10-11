namespace Biomass.Server.Models.CostCenter
{
    public class CostCenterViewDto
    {
        public int CostCenterId { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public bool IsActive { get; set; }
        public int? ParentCostCenterId { get; set; }
        public int? CompanyId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? CostCenterType { get; set; }
        public int? ParentId { get; set; }
        public string? ParentCode { get; set; }
        public string? ParentName { get; set; }
        public bool? ParentIsActive { get; set; }
    }
}
