using Biomass.Api.Model;
using System.Collections.Generic;

namespace Biomass.Server.Interfaces
{
	public class EmployeeDto
	{
		public int EmployeeId { get; set; }
		public string FullName { get; set; } = string.Empty;
		public string? Designation { get; set; }
		public string? Phone { get; set; }
		public DateTime CreatedAt { get; set; }
	}

	public class CreateEmployeeRequest
	{
		public string FullName { get; set; } = string.Empty;
		public string? Designation { get; set; }
		public string? Phone { get; set; }
	}

	public class UpdateEmployeeRequest
	{
		public int EmployeeId { get; set; }
		public string FullName { get; set; } = string.Empty;
		public string? Designation { get; set; }
		public string? Phone { get; set; }
	}

	public interface IEmployeeService
	{
		Task<ServiceResponse<EmployeeListResponse>> GetAllAsync(int page, int pageSize, string? term = null);
		Task<ServiceResponse<EmployeeDto>> GetByIdAsync(int id);
		Task<ServiceResponse<EmployeeDto>> CreateAsync(CreateEmployeeRequest request);
		Task<ServiceResponse<EmployeeDto>> UpdateAsync(int id, UpdateEmployeeRequest request);
		Task<ServiceResponse<bool>> DeleteAsync(int id);
	}

	public class EmployeeListResponse
	{
		public IEnumerable<EmployeeDto> Items { get; set; } = new List<EmployeeDto>();
		public int TotalCount { get; set; }
	}
}
