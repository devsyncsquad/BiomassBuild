using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Interfaces;
using Biomass.Api.Model;
using Biomass.Server.Models.CostCenter;

namespace Biomass.Server.Controllers.Api
{
	[ApiController]
	[Route("api/[controller]")]
	public class CostCentersController : ControllerBase
	{
		private readonly ICostCenterService _service;

		public CostCentersController(ICostCenterService service)
		{
			_service = service;
		}

        // Controller
        [HttpGet("GetAllCostCentersView")]
        public async Task<ActionResult<ServiceResponse<List<VCostCenter>>>> GetAllCostCentersView()
        {
            var result = await _service.GetAllViewAsync();
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("GetCostCenterTree")]
		public async Task<IActionResult> GetCostCenterTree([FromQuery] int? companyId = null)
		{
			var result = await _service.GetTreeAsync(companyId);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetCostCenterById/{id}")]
		public async Task<IActionResult> GetCostCenterById(int id)
		{
			var result = await _service.GetByIdAsync(id);
			if (!result.Success) return NotFound(result);
			return Ok(result);
		}

		[HttpGet("GetSubCostCenters/{parentId}")]
		public async Task<IActionResult> GetSubCostCenters(int parentId)
		{
			var result = await _service.GetChildrenAsync(parentId);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetActiveParentCostCentersWithChildren")]
		public async Task<IActionResult> GetActiveParentCostCentersWithChildren([FromQuery] int? companyId = null)
		{
			var result = await _service.GetActiveParentCostCentersAsync(companyId);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetActiveParentCostCenters")]
		public async Task<IActionResult> GetActiveParentCostCenters([FromQuery] int? companyId = null)
		{
			var result = await _service.GetActiveParentCostCentersOnlyAsync(companyId);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpPost("CreateCostCenter")]
		public async Task<IActionResult> CreateCostCenter([FromBody] CreateCostCenterRequest request)
		{
			var result = await _service.CreateAsync(request);
			if (!result.Success) return BadRequest(result);
			return CreatedAtAction(nameof(GetCostCenterById), new { id = result.Result?.CostCenterId }, result);
		}

		[HttpPut("UpdateCostCenter/{id}")]
		public async Task<IActionResult> UpdateCostCenter(int id, [FromBody] UpdateCostCenterRequest request)
		{
			if (id != request.CostCenterId) return BadRequest(new ServiceResponse<bool> { Success = false, Message = "ID mismatch" });
			var result = await _service.UpdateAsync(id, request);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpPut("ReparentCostCenter/{id}")]
		public async Task<IActionResult> ReparentCostCenter(int id, [FromBody] int? newParentId)
		{
			var result = await _service.ReparentAsync(id, newParentId);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpDelete("DeleteCostCenter/{id}")]
		public async Task<IActionResult> DeleteCostCenter(int id)
		{
			// Frontend will show warning before calling; backend cascades as configured
			var result = await _service.DeleteAsync(id, cascade: true);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}
	}
}


