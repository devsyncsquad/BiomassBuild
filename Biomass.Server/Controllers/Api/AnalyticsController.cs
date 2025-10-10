using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Interfaces;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

       
        [HttpGet("GetEntriesBySlipNumber")]
        public async Task<IActionResult> GetEntriesBySlipNumber([FromQuery] string slipNumber)
        {
            var result = await _analyticsService.GetEntriesBySlipNumberAsync(slipNumber);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }
}
