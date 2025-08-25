using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models;
using Biomass.Server.Models.Lookup;
using Microsoft.AspNetCore.Mvc;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/lookups")]
    public class LookupsController : ControllerBase
    {
        private readonly ILookupService _lookupService;

        public LookupsController(ILookupService lookupService)
        {
            _lookupService = lookupService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<Lookup>>>> GetAllLookups()
        {
            var lookups = await _lookupService.GetAllLookupsAsync();
            return Ok(new ServiceResponse<List<Lookup>>
            {
                Result = lookups,
                Message = "Lookups retrieved successfully",
                Success = true
            });
        }

        [HttpPost("by-domain")]
        public async Task<ActionResult<ServiceResponse<List<Lookup>>>> GetLookupsByDomain([FromBody] LookupByDomainRequest request)
        {
            if (string.IsNullOrEmpty(request.Domain))
            {
                return BadRequest(new ServiceResponse<List<Lookup>>
                {
                    Message = "Domain is required",
                    Success = false
                });
            }

            var lookups = await _lookupService.GetLookupsByDomainAsync(request.Domain);
            return Ok(new ServiceResponse<List<Lookup>>
            {
                Result = lookups,
                Message = $"Lookups for domain '{request.Domain}' retrieved successfully",
                Success = true
            });
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<Lookup>>> CreateLookup([FromBody] Lookup lookup)
        {
            var createdLookup = await _lookupService.CreateLookupAsync(lookup);
            return Ok(new ServiceResponse<Lookup>
            {
                Result = createdLookup,
                Message = "Lookup created successfully",
                Success = true
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<Lookup>>> UpdateLookup(int id, [FromBody] Lookup lookup)
        {
            var updatedLookup = await _lookupService.UpdateLookupAsync(id, lookup);
            if (updatedLookup == null)
            {
                return NotFound(new ServiceResponse<Lookup>
                {
                    Message = "Lookup not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<Lookup>
            {
                Result = updatedLookup,
                Message = "Lookup updated successfully",
                Success = true
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteLookup(int id)
        {
            var result = await _lookupService.DeleteLookupAsync(id);
            if (!result)
            {
                return NotFound(new ServiceResponse<bool>
                {
                    Message = "Lookup not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<bool>
            {
                Result = true,
                Message = "Lookup deleted successfully",
                Success = true
            });
        }
    }
}