using Biomass.Api.Model;
using Biomass.Server.Models.CostCenter;
using System.Collections.Generic;

namespace Biomass.Server.Interfaces
{
	public class CostCenterDto
	{
		public int CostCenterId { get; set; }
		public string Code { get; set; } = string.Empty;
		public string Name { get; set; } = string.Empty;
		public bool? IsActive { get; set; } = true;
		public int? ParentCostCenterId { get; set; }
		public int? CompanyId { get; set; }
		public DateTime? CreatedAt { get; set; }
		public List<CostCenterDto> Children { get; set; } = new();
	}

	public class CreateCostCenterRequest
	{
		public string Name { get; set; } = string.Empty;
		public bool IsActive { get; set; } = true;
		public int? ParentCostCenterId { get; set; }
		public int? CompanyId { get; set; }
	}

	public class UpdateCostCenterRequest
	{
		public int CostCenterId { get; set; }
		public string Name { get; set; } = string.Empty;
		public bool IsActive { get; set; } = true;
		public int? ParentCostCenterId { get; set; }
		public int? CompanyId { get; set; }
	}

	public interface ICostCenterService
	{
		Task<ServiceResponse<List<VCostCenter>>> GetAllViewAsync();

        Task<ServiceResponse<List<CostCenterDto>>> GetTreeAsync(int? companyId = null);
		Task<ServiceResponse<CostCenterDto>> GetByIdAsync(int id);
		Task<ServiceResponse<List<CostCenterDto>>> GetChildrenAsync(int parentId);
		Task<ServiceResponse<List<CostCenterDto>>> GetActiveParentCostCentersAsync(int? companyId = null);
		Task<ServiceResponse<List<CostCenterDto>>> GetActiveParentCostCentersOnlyAsync(int? companyId = null);
		Task<ServiceResponse<CostCenterDto>> CreateAsync(CreateCostCenterRequest request);
		Task<ServiceResponse<CostCenterDto>> UpdateAsync(int id, UpdateCostCenterRequest request);
		Task<ServiceResponse<bool>> DeleteAsync(int id, bool cascade = true);
		Task<ServiceResponse<bool>> ReparentAsync(int id, int? newParentId);
	}
}


