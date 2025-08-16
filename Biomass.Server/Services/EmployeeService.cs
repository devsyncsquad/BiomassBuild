using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Employee;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Biomass.Server.Services
{
	public class EmployeeService : IEmployeeService
	{
		private readonly ApplicationDbContext _db;

		public EmployeeService(ApplicationDbContext db)
		{
			_db = db;
		}

		public async Task<ServiceResponse<EmployeeListResponse>> GetAllAsync(int page, int pageSize, string? term = null)
		{
			var response = new ServiceResponse<EmployeeListResponse>();
			try
			{
				page = page <= 0 ? 1 : page;
				pageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);

				var query = _db.Employees.AsNoTracking().AsQueryable();
				
				if (!string.IsNullOrWhiteSpace(term))
				{
					var t = term.Trim().ToLower();
					query = query.Where(e => 
						e.FullName.ToLower().Contains(t) || 
						(e.Designation != null && e.Designation.ToLower().Contains(t)) ||
						(e.Phone != null && e.Phone.Contains(t)));
				}

				var total = await query.CountAsync();
				var entities = await query
					.OrderBy(e => e.FullName)
					.Skip((page - 1) * pageSize)
					.Take(pageSize)
					.ToListAsync();
				
				var items = entities.Select(Map).ToList();

				// Debug logging
				Console.WriteLine($"Total employees found: {total}");
				Console.WriteLine($"Entities retrieved: {entities.Count}");
				Console.WriteLine($"Items mapped: {items.Count}");

				response.Result = new EmployeeListResponse
				{
					Items = items,
					TotalCount = total
				};
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<EmployeeDto>> GetByIdAsync(int id)
		{
			var response = new ServiceResponse<EmployeeDto>();
			try
			{
				var entity = await _db.Employees.FindAsync(id);
				if (entity == null)
				{
					response.Success = false;
					response.Message = "Employee not found";
					return response;
				}
				
				response.Result = Map(entity);
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<EmployeeDto>> CreateAsync(CreateEmployeeRequest request)
		{
			var response = new ServiceResponse<EmployeeDto>();
			try
			{
				if (string.IsNullOrWhiteSpace(request.FullName))
				{
					response.Success = false;
					response.Message = "Full name is required";
					return response;
				}

				var entity = new Employee
				{
					FullName = request.FullName.Trim(),
					Designation = !string.IsNullOrWhiteSpace(request.Designation) ? request.Designation.Trim() : null,
					Phone = !string.IsNullOrWhiteSpace(request.Phone) ? request.Phone.Trim() : null,
					CreatedAt = DateTime.UtcNow
				};

				_db.Employees.Add(entity);
				await _db.SaveChangesAsync();

				response.Result = Map(entity);
				response.Success = true;
				response.Message = "Employee created successfully";
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<EmployeeDto>> UpdateAsync(int id, UpdateEmployeeRequest request)
		{
			var response = new ServiceResponse<EmployeeDto>();
			try
			{
				var entity = await _db.Employees.FirstOrDefaultAsync(e => e.EmployeeId == id);
				if (entity == null)
				{
					response.Success = false;
					response.Message = "Employee not found";
					return response;
				}

				if (string.IsNullOrWhiteSpace(request.FullName))
				{
					response.Success = false;
					response.Message = "Full name is required";
					return response;
				}

				entity.FullName = request.FullName.Trim();
				entity.Designation = !string.IsNullOrWhiteSpace(request.Designation) ? request.Designation.Trim() : null;
				entity.Phone = !string.IsNullOrWhiteSpace(request.Phone) ? request.Phone.Trim() : null;

				await _db.SaveChangesAsync();

				response.Result = Map(entity);
				response.Success = true;
				response.Message = "Employee updated successfully";
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<bool>> DeleteAsync(int id)
		{
			var response = new ServiceResponse<bool>();
			try
			{
				var entity = await _db.Employees.FirstOrDefaultAsync(e => e.EmployeeId == id);
				if (entity == null)
				{
					response.Success = false;
					response.Message = "Employee not found";
					return response;
				}

				_db.Employees.Remove(entity);
				await _db.SaveChangesAsync();
				
				response.Result = true;
				response.Success = true;
				response.Message = "Employee deleted successfully";
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		private static EmployeeDto Map(Employee e) => new EmployeeDto
		{
			EmployeeId = e.EmployeeId,
			FullName = e.FullName,
			Designation = e.Designation,
			Phone = e.Phone,
			CreatedAt = e.CreatedAt
		};
	}
}
