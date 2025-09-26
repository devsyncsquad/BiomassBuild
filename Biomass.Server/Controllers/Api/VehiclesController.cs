using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models;
using Biomass.Server.Models.Vehicle;
using Microsoft.AspNetCore.Mvc;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/vehicles")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehiclesController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<VehicleDto>>>> GetVehicles()
        {
            var vehicles = await _vehicleService.GetVehiclesAsync();
            return Ok(new ServiceResponse<List<VehicleDto>>
            {
                Result = vehicles,
                Message = "Vehicles retrieved successfully",
                Success = true
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<VehicleDto>>> GetVehicle(int id)
        {
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
            if (vehicle == null)
            {
                return NotFound(new ServiceResponse<VehicleDto>
                {
                    Message = "Vehicle not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<VehicleDto>
            {
                Result = vehicle,
                Message = "Vehicle retrieved successfully",
                Success = true
            });
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<VehicleDto>>> CreateVehicle(CreateVehicleRequest request)
        {
            try
            {
                var dto = await _vehicleService.CreateVehicleWithDriverAsync(request);
                return Ok(new ServiceResponse<VehicleDto>
                {
                    Result = dto,
                    Success = true,
                    Message = "Vehicle created successfully"
                });
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
            {
                return Conflict(new ServiceResponse<VehicleDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<VehicleDto>>> UpdateVehicle(int id, [FromBody] UpdateVehicleRequest request)
        {
            var vehicle = await _vehicleService.UpdateVehicleWithDriverAsync(id, request);
            if (vehicle == null)
            {
                return NotFound(new ServiceResponse<VehicleDto>
                {
                    Message = "Vehicle not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<VehicleDto>
            {
                Result = vehicle,
                Message = "Vehicle updated successfully",
                Success = true
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteVehicle(int id)
        {
            var result = await _vehicleService.DeleteVehicleAsync(id);
            if (!result)
            {
                return NotFound(new ServiceResponse<bool>
                {
                    Message = "Vehicle not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<bool>
            {
                Result = true,
                Message = "Vehicle deleted successfully",
                Success = true
            });
        }
    }
}
