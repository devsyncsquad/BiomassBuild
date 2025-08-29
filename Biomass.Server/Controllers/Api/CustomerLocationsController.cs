using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Customer;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerLocationsController : ControllerBase
    {
        private readonly ICustomerLocationService _locationService;

        public CustomerLocationsController(ICustomerLocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet("GetAllLocations")]
        public async Task<IActionResult> GetAllLocations()
        {
            var response = await _locationService.GetAllLocationsAsync();
            return Ok(response);
        }

        [HttpGet("GetLocationById/{id}")]
        public async Task<IActionResult> GetLocationById(int id)
        {
            var response = await _locationService.GetLocationByIdAsync(id);
            if (!response.Success)
                return NotFound(response);
            return Ok(response);
        }

        [HttpGet("GetLocationsByCustomerId/{customerId}")]
        public async Task<IActionResult> GetLocationsByCustomerId(int customerId)
        {
            var response = await _locationService.GetLocationsByCustomerIdAsync(customerId);
            return Ok(response);
        }

        [HttpPost("CreateLocation")]
        public async Task<IActionResult> CreateLocation([FromBody] CreateCustomerLocationRequest request)
        {
            var response = await _locationService.CreateLocationAsync(request);
            if (!response.Success)
                return BadRequest(response);
            return CreatedAtAction(nameof(GetLocationById), new { id = response.Result.LocationId }, response);
        }

        [HttpPut("UpdateLocation/{id}")]
        public async Task<IActionResult> UpdateLocation(int id, [FromBody] UpdateCustomerLocationRequest request)
        {
            var response = await _locationService.UpdateLocationAsync(id, request);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpDelete("DeleteLocation/{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            var response = await _locationService.DeleteLocationAsync(id);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }
        
        [HttpGet("GetLocationCostsForDispatch/{locationId}")]
        public async Task<IActionResult> GetLocationCostsForDispatch(int locationId)
        {
            var response = await _locationService.GetLocationCostsForDispatchAsync(locationId);
            if (!response.Success)
                return NotFound(response);
            return Ok(response);
        }

        [HttpGet("SearchLocations")]
        public async Task<IActionResult> SearchLocations([FromQuery] string searchTerm, [FromQuery] string status = "all")
        {
            var response = await _locationService.SearchLocationsAsync(searchTerm, status);
            return Ok(response);
        }

        [HttpGet("GetLocationCount/{customerId}")]
        public async Task<IActionResult> GetLocationCount(int customerId)
        {
            var response = await _locationService.GetLocationCountAsync(customerId);
            return Ok(response);
        }

        // New View-based endpoints
        [HttpGet("GetAllLocationsView")]
        public async Task<IActionResult> GetAllLocationsView()
        {
            var response = await _locationService.GetAllLocationsViewAsync();
            return Ok(response);
        }

        [HttpGet("GetLocationsByCustomerIdView/{customerId}")]
        public async Task<IActionResult> GetLocationsByCustomerIdView(int customerId)
        {
            var response = await _locationService.GetLocationsByCustomerIdViewAsync(customerId);
            return Ok(response);
        }
    }
}