using Biomass.Server.Interfaces;
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

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? domain, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetAsync(domain, page, pageSize);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLookupRequest request)
        {
            var createdBy = User?.Identity?.Name ?? "system";
            var result = await _service.CreateAsync(request, createdBy);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateLookupRequest request)
        {
            request.LookUpId = id;
            var result = await _service.UpdateAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}


