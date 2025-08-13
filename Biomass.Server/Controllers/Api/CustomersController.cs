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

        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
            var response = await _customerService.GetAllCustomersAsync();
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var response = await _customerService.GetCustomerByIdAsync(id);
            if (!response.Success)
                return NotFound(response);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
        {
            var response = await _customerService.CreateCustomerAsync(request);
            if (!response.Success)
                return BadRequest(response);
            return CreatedAtAction(nameof(GetCustomerById), new { id = response.Result.CustomerId }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] UpdateCustomerRequest request)
        {
            var response = await _customerService.UpdateCustomerAsync(id, request);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var response = await _customerService.DeleteCustomerAsync(id);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchCustomers([FromQuery] string searchTerm, [FromQuery] string status = "all")
        {
            var response = await _customerService.SearchCustomersAsync(searchTerm, status);
            return Ok(response);
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetCustomerCount()
        {
            var response = await _customerService.GetCustomerCountAsync();
            return Ok(response);
        }
    }
} 