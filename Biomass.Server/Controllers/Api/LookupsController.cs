using Biomass.Server.Interfaces;
using Biomass.Server.Models.Lookup;
using Microsoft.AspNetCore.Mvc;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupsController : ControllerBase
    {
        private readonly ILookupService _service;
        public LookupsController(ILookupService service)
        {
            _service = service;
        }

        [HttpGet("GetAllLookups")]
        public async Task<IActionResult> Get([FromQuery] string? domain, [FromQuery] string? status, [FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var response = await _service.GetAsync(domain, status, search, page, pageSize);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Get all lookups without pagination for frontend filtering
        /// </summary>
        [HttpGet("GetAllLookupsUnpaginated")]
        public async Task<IActionResult> GetAllUnpaginated([FromQuery] string? domain, [FromQuery] string? status, [FromQuery] string? search)
        {
            var response = await _service.GetAllUnpaginatedAsync(domain, status, search);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet("GetLookupById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPost("CreateLookup")]
        public async Task<IActionResult> Create([FromBody] CreateLookupRequest request)
        {
            var result = await _service.CreateAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("UpdateLookup/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateLookupRequest request)
        {
            request.LookupId = id;
            var result = await _service.UpdateAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("DeleteLookup/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        /// <summary>
        /// Get lookup statistics (Total, Enabled, Disabled, Pending)
        /// </summary>
        [HttpGet("GetStatistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var result = await _service.GetStatisticsAsync();
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        /// <summary>
        /// Get all distinct domains
        /// </summary>
        [HttpGet("GetDomains")]
        public async Task<IActionResult> GetDomains()
        {
            var result = await _service.GetDomainsAsync();
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        /// <summary>
        /// Get all lookups grouped by domain in a single response
        /// </summary>
        [HttpGet("GetLookupsByDomains")]
        public async Task<IActionResult> GetLookupsByDomains()
        {
            var result = await _service.GetLookupsByDomainsAsync();
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }
}


