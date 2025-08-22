using Biomass.Server.Interfaces;
using Biomass.Server.Models.Lookup;
using Biomass.Server.Services;
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

        //[HttpGet("GetAllLookups")]
        //      public async Task<IActionResult> Get([FromQuery] string? domain, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        //      {
        //          var result = await _service.GetAsync(domain, page, pageSize);
        //          if (!result.Success) return BadRequest(result);
        //          return Ok(result);
        //      }

        [HttpGet("GetAllLookups")]
        public async Task<IActionResult> Get([FromQuery] string? domain, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var response = await _service.GetAsync(domain, page, pageSize);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            // Explicitly format the response to ensure proper serialization
            return Ok(new
            {
                Result = new
                {
                    Items = response.Result.Items,
                    TotalCount = response.Result.TotalCount
                },
                Message = response.Message,
                Success = response.Success
            });
        }

        [HttpGet("GetLookupById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

		[HttpPost("CreateLookup")]
        public async Task<IActionResult> Create([FromBody] Lookup request)
        {
            var createdBy = User?.Identity?.Name ?? "system";
            var result = await _service.CreateAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

		[HttpPut("UpdateLookup/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateLookupRequest request)
        {
            request.LookUpId = id;
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


