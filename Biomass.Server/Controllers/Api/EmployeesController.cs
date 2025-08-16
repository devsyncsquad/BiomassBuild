using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Interfaces;
using Biomass.Api.Model;

namespace Biomass.Server.Controllers.Api
{
	[ApiController]
	[Route("api/[controller]")]
	public class EmployeesController : ControllerBase
	{
		private readonly IEmployeeService _service;

		public EmployeesController(IEmployeeService service)
		{
			_service = service;
		}

		[HttpGet("GetAllEmployees")]
		public async Task<IActionResult> GetAllEmployees([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? term = null)
		{
			var result = await _service.GetAllAsync(page, pageSize, term);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetEmployeeCount")]
		public async Task<IActionResult> GetEmployeeCount()
		{
			try
			{
				var result = await _service.GetAllAsync(1, 1, null);
				if (!result.Success) return BadRequest(result);
				return Ok(new { TotalCount = result.Result?.TotalCount ?? 0, Success = true });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Success = false, Message = ex.Message });
			}
		}

		[HttpGet("TestDatabaseConnection")]
		public async Task<IActionResult> TestDatabaseConnection()
		{
			try
			{
				// This will test if the database connection and table access works
				var result = await _service.GetAllAsync(1, 1, null);
				return Ok(new { 
					Success = true, 
					DatabaseAccessible = result.Success,
					TotalCount = result.Result?.TotalCount ?? 0,
					HasItems = result.Result?.Items?.Any() ?? false
				});
			}
			catch (Exception ex)
			{
				return BadRequest(new { Success = false, Message = ex.Message, ExceptionType = ex.GetType().Name });
			}
		}

		[HttpGet("GetEmployeeById/{id}")]
		public async Task<IActionResult> GetEmployeeById(int id)
		{
			var result = await _service.GetByIdAsync(id);
			if (!result.Success) return NotFound(result);
			return Ok(result);
		}

		[HttpPost("CreateEmployee")]
		public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeRequest request)
		{
			var result = await _service.CreateAsync(request);
			if (!result.Success) return BadRequest(result);
			return CreatedAtAction(nameof(GetEmployeeById), new { id = result.Result?.EmployeeId }, result);
		}

		[HttpPut("UpdateEmployee/{id}")]
		public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeRequest request)
		{
			if (id != request.EmployeeId) return BadRequest(new ServiceResponse<bool> { Success = false, Message = "ID mismatch" });
			var result = await _service.UpdateAsync(id, request);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpDelete("DeleteEmployee/{id}")]
		public async Task<IActionResult> DeleteEmployee(int id)
		{
			var result = await _service.DeleteAsync(id);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}
	}
}
