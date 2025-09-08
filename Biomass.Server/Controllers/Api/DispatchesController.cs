using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models;
using Biomass.Server.Models.Dispatch;
using Microsoft.AspNetCore.Mvc;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/dispatches")]
    public class DispatchesController : ControllerBase
    {
        private readonly IDispatchService _dispatchService;

        public DispatchesController(IDispatchService dispatchService)
        {
            _dispatchService = dispatchService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<DispatchDto>>>> GetDispatches()
        {
            var dispatches = await _dispatchService.GetDispatchesAsync();
            return Ok(new ServiceResponse<List<DispatchDto>>
            {
                Result = dispatches,
                Message = "Dispatches retrieved successfully",
                Success = true
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<DispatchDto>>> GetDispatch(int id)
        {
            var dispatch = await _dispatchService.GetDispatchByIdAsync(id);
            if (dispatch == null)
            {
                return NotFound(new ServiceResponse<DispatchDto>
                {
                    Message = "Dispatch not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<DispatchDto>
            {
                Result = dispatch,
                Message = "Dispatch retrieved successfully",
                Success = true
            });
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<int>>> CreateDispatch([FromBody] CreateDispatchRequest request)
        {
            var dispatchId = await _dispatchService.CreateDispatchAsync(request);
            return CreatedAtAction(nameof(GetDispatch), new { id = dispatchId }, new ServiceResponse<int>
            {
                Result = dispatchId,
                Message = "Dispatch created successfully",
                Success = true
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<DispatchDto>>> UpdateDispatch(int id, [FromBody] UpdateDispatchRequest request)
        {
            var dispatch = await _dispatchService.UpdateDispatchAsync(id, request);
            if (dispatch == null)
            {
                return NotFound(new ServiceResponse<DispatchDto>
                {
                    Message = "Dispatch not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<DispatchDto>
            {
                Result = dispatch,
                Message = "Dispatch updated successfully",
                Success = true
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteDispatch(int id)
        {
            var result = await _dispatchService.DeleteDispatchAsync(id);
            if (!result)
            {
                return NotFound(new ServiceResponse<bool>
                {
                    Message = "Dispatch not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<bool>
            {
                Result = true,
                Message = "Dispatch deleted successfully",
                Success = true
            });
        }
    }
}
