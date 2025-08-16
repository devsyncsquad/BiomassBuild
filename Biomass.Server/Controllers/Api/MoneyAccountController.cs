using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Interfaces;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoneyAccountController : ControllerBase
    {
        private readonly IMoneyAccountService _service;

        public MoneyAccountController(IMoneyAccountService service)
        {
            _service = service;
        }

        [HttpPost("CreateMoneyAccount")]
        public async Task<IActionResult> CreateMoneyAccount([FromBody] CreateMoneyAccountRequest request)
        {
            var createdBy = User?.Identity?.Name ?? "system";
            var result = await _service.CreateAsync(request, createdBy);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("UpdateMoneyAccount/{id}")]
        public async Task<IActionResult> UpdateMoneyAccount(int id, [FromBody] UpdateMoneyAccountRequest request)
        {
            var updatedBy = User?.Identity?.Name ?? "system";
            var result = await _service.UpdateAsync(id, request, updatedBy);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("DeleteMoneyAccount/{id}")]
        public async Task<IActionResult> DeleteMoneyAccount(int id)
        {
            var deletedBy = User?.Identity?.Name ?? "system";
            var result = await _service.DeleteAsync(id, deletedBy);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpGet("GetAllMoneyAccount")]
        public async Task<IActionResult> GetAllMoneyAccount(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] int? kindLookupId = null,
            [FromQuery] bool? isActive = null)
        {
            var result = await _service.GetAllAsync(page, pageSize, kindLookupId, isActive);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("SetDefault/{id}")]
        public async Task<IActionResult> SetDefault(int id)
        {
            var updatedBy = User?.Identity?.Name ?? "system";
            var result = await _service.SetDefaultAsync(id, updatedBy);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("GetDefaultMoneyAccount")]
        public async Task<IActionResult> GetDefaultMoneyAccount()
        {
            var result = await _service.GetDefaultAccountAsync();
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("GetMoneyAccountByKindLookupId/{kindLookupId}")]
        public async Task<IActionResult> GetMoneyAccountByKindLookupId(int kindLookupId)
        {
            var result = await _service.GetMoneyAccountsByKindLookupIdAsync(kindLookupId);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}
