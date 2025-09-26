using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Customer;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

		[HttpGet("GetAllCustomers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var response = await _customerService.GetAllCustomersAsync();
            return Ok(response);
        }

		[HttpGet("GetCustomerById/{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var response = await _customerService.GetCustomerByIdAsync(id);
            if (!response.Success)
                return NotFound(response);
            return Ok(response);
        }

		[HttpPost("CreateCustomer")]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
        {
            var response = await _customerService.CreateCustomerAsync(request);
            if (!response.Success)
                return BadRequest(response);
            return CreatedAtAction(nameof(GetCustomerById), new { id = response.Result.CustomerId }, response);
        }

		[HttpPut("UpdateCustomer/{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] UpdateCustomerRequest request)
        {
            var response = await _customerService.UpdateCustomerAsync(id, request);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

		[HttpDelete("DeleteCustomer/{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var response = await _customerService.DeleteCustomerAsync(id);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

		[HttpGet("SearchCustomers")]
        public async Task<IActionResult> SearchCustomers([FromQuery] string searchTerm, [FromQuery] string status = "all")
        {
            var response = await _customerService.SearchCustomersAsync(searchTerm, status);
            return Ok(response);
        }

		[HttpGet("GetCustomerCount")]
        public async Task<IActionResult> GetCustomerCount()
        {
            var response = await _customerService.GetCustomerCountAsync();
            return Ok(response);
        }

		[HttpGet("GetCustomersByUserId/{userId}")]
        public async Task<IActionResult> GetCustomersByUserId(int userId)
        {
            var response = await _customerService.GetCustomersByUserIdAsync(userId);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }
    }
} 