using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models;
using Biomass.Server.Models.Driver;
using Microsoft.AspNetCore.Mvc;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/drivers")]
    public class DriversController : ControllerBase
    {
        private readonly IDriverService _driverService;

        public DriversController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<DriverDto>>>> GetDrivers()
        {
            var drivers = await _driverService.GetDriversAsync();
            return Ok(new ServiceResponse<List<DriverDto>>
            {
                Result = drivers,
                Message = "Drivers retrieved successfully",
                Success = true
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<DriverDto>>> GetDriver(int id)
        {
            var driver = await _driverService.GetDriverByIdAsync(id);
            if (driver == null)
            {
                return NotFound(new ServiceResponse<DriverDto>
                {
                    Message = "Driver not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<DriverDto>
            {
                Result = driver,
                Message = "Driver retrieved successfully",
                Success = true
            });
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<DriverDto>>> CreateDriver([FromBody] CreateDriverRequest request)
        {
            var driver = await _driverService.CreateDriverAsync(request);

            return Ok(new ServiceResponse<DriverDto>
            {
                //Result = driver,
                Message = "Driver created successfully",
                Success = true
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<DriverDto>>> UpdateDriver(int id, [FromBody] UpdateDriverRequest request)
        {
            var driver = await _driverService.UpdateDriverAsync(id, request);
            if (driver == null)
            {
                return NotFound(new ServiceResponse<DriverDto>
                {
                    Message = "Driver not found",
                    Success = false
                });
            }

            var driverDto = driver.ToDto(); // Map Driver to DriverDto
            return Ok(new ServiceResponse<DriverDto>
            {
                Result = driverDto,
                Message = "Driver updated successfully",
                Success = true
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteDriver(int id)
        {
            var result = await _driverService.DeleteDriverAsync(id);
            if (!result)
            {
                return NotFound(new ServiceResponse<bool>
                {
                    Message = "Driver not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<bool>
            {
                Result = true,
                Message = "Driver deleted successfully",
                Success = true
            });
        }
    }
    public static class DriverMappingExtensions
    {
        public static DriverDto ToDto(this Driver driver)
        {
            return new DriverDto
            {
                DriverId = driver.DriverId,
                FullName = driver.FullName,
                CNIC = driver.CNIC,
                LicenseNumber = driver.LicenseNumber,
                PhoneNumber = driver.PhoneNumber,
                Address = driver.Address,
                Status = driver.Status,
                CreatedOn = driver.CreatedOn
            };
        }
    }
}
