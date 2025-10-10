using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models;
using Biomass.Server.Models.CostCenter;
using Microsoft.AspNetCore.Mvc;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/cost-centers")]
    public class CostCentersController : ControllerBase
    {
        private readonly ICostCenterService _costCenterService;

        public CostCentersController(ICostCenterService costCenterService)
        {
            _costCenterService = costCenterService;
        }

        [HttpGet("GetAllCostCentersView")]
        public async Task<ActionResult<ServiceResponse<List<CostCenterDto>>>> GetAllCostCenters()
        {
            var costCenters = await _costCenterService.GetAllCostCentersAsync();
            return Ok(new ServiceResponse<List<CostCenterDto>>
            {
                Result = costCenters,
                Message = "Cost centers retrieved successfully",
                Success = true
            });
        }

        [HttpGet("active")]
        public async Task<ActionResult<ServiceResponse<List<CostCenterDto>>>> GetActiveCostCenters()
        {
            var costCenters = await _costCenterService.GetActiveCostCentersAsync();
            return Ok(new ServiceResponse<List<CostCenterDto>>
            {
                Result = costCenters,
                Message = "Active cost centers retrieved successfully",
                Success = true
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<CostCenterDto>>> GetCostCenter(int id)
        {
            var costCenter = await _costCenterService.GetCostCenterByIdAsync(id);
            if (costCenter == null)
            {
                return NotFound(new ServiceResponse<CostCenterDto>
                {
                    Message = "Cost center not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<CostCenterDto>
            {
                Result = costCenter,
                Message = "Cost center retrieved successfully",
                Success = true
            });
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<CostCenterDto>>> CreateCostCenter([FromBody] CostCenter costCenter)
        {
            var createdCostCenter = await _costCenterService.CreateCostCenterAsync(costCenter);
            return Ok(new ServiceResponse<CostCenterDto>
            {
                Result = createdCostCenter,
                Message = "Cost center created successfully",
                Success = true
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<CostCenterDto>>> UpdateCostCenter(int id, [FromBody] CostCenter costCenter)
        {
            var updatedCostCenter = await _costCenterService.UpdateCostCenterAsync(id, costCenter);
            if (updatedCostCenter == null)
            {
                return NotFound(new ServiceResponse<CostCenterDto>
                {
                    Message = "Cost center not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<CostCenterDto>
            {
                Result = updatedCostCenter,
                Message = "Cost center updated successfully",
                Success = true
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteCostCenter(int id)
        {
            var result = await _costCenterService.DeleteCostCenterAsync(id);
            if (!result)
            {
                return NotFound(new ServiceResponse<bool>
                {
                    Message = "Cost center not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<bool>
            {
                Result = true,
                Message = "Cost center deleted successfully",
                Success = true
            });
        }

        [HttpGet("GetActiveParentCostCentersWithChildren")]
        public async Task<ActionResult<ServiceResponse<List<CostCenterDto>>>> GetActiveParentCostCentersWithChildren([FromQuery] int? companyId = null)
        {
            var costCenters = await _costCenterService.GetActiveParentCostCentersAsync(companyId);
            return Ok(new ServiceResponse<List<CostCenterDto>>
            {
                Result = costCenters,
                Message = "Active parent cost centers with children retrieved successfully",
                Success = true
            });
        }

        [HttpGet("GetUserActiveParentCostCentersWithChildren")]
        public async Task<ActionResult<ServiceResponse<List<CostCenterDto>>>> GetUserActiveParentCostCentersWithChildren([FromQuery] int userId, [FromQuery] int? companyId = null)
        {
            // TODO: Add authorization check to validate userId against current user
            // This should be implemented based on your authentication system
            
            var costCenters = await _costCenterService.GetUserActiveParentCostCentersAsync(userId, companyId);
            return Ok(new ServiceResponse<List<CostCenterDto>>
            {
                Result = costCenters,
                Message = "User active parent cost centers with children retrieved successfully",
                Success = true
            });
        }
    }
}