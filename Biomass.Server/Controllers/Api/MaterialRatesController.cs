using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Services.Interfaces;
using Biomass.Server.Models.Customer;
using Biomass.Api.Model;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaterialRatesController : ControllerBase
    {
        private readonly IMaterialRateService _materialRateService;

        public MaterialRatesController(IMaterialRateService materialRateService)
        {
            _materialRateService = materialRateService;
        }

        [HttpGet("GetAllMaterialRates")]
        public async Task<ActionResult<ServiceResponse<List<MaterialRateDto>>>> GetAllMaterialRates()
        {
            var response = await _materialRateService.GetAllMaterialRatesAsync();
            return Ok(response);
        }

        [HttpGet("GetMaterialRateById/{id}")]
        public async Task<ActionResult<ServiceResponse<MaterialRateDto>>> GetMaterialRateById(int id)
        {
            var response = await _materialRateService.GetMaterialRateByIdAsync(id);
            return Ok(response);
        }

        [HttpGet("GetMaterialRatesByLocationId/{locationId}")]
        public async Task<ActionResult<ServiceResponse<List<MaterialRateDto>>>> GetMaterialRatesByLocationId(int locationId)
        {
            var response = await _materialRateService.GetMaterialRatesByLocationIdAsync(locationId);
            return Ok(response);
        }

        [HttpGet("CheckExistingActiveRates")]
        public async Task<ActionResult<ServiceResponse<List<MaterialRateDto>>>> CheckExistingActiveRates(
            [FromQuery] int customerId, 
            [FromQuery] int locationId, 
            [FromQuery] string materialType, 
            [FromQuery] string effectiveDate)
        {
            var response = await _materialRateService.CheckExistingActiveRatesAsync(customerId, locationId, materialType, effectiveDate);
            return Ok(response);
        }

        [HttpPost("CreateMaterialRate")]
        public async Task<ActionResult<ServiceResponse<MaterialRateDto>>> CreateMaterialRate(CreateMaterialRateRequest request)
        {
            var response = await _materialRateService.CreateMaterialRateAsync(request);
            return Ok(response);
        }

        [HttpPut("UpdateMaterialRate/{id}")]
        public async Task<ActionResult<ServiceResponse<MaterialRateDto>>> UpdateMaterialRate(int id, UpdateMaterialRateRequest request)
        {
            var response = await _materialRateService.UpdateMaterialRateAsync(id, request);
            return Ok(response);
        }

        [HttpDelete("DeleteMaterialRate/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteMaterialRate(int id)
        {
            var response = await _materialRateService.DeleteMaterialRateAsync(id);
            return Ok(response);
        }

        //[HttpGet("daterange")]
        //public async Task<ActionResult<ServiceResponse<List<MaterialRateDto>>>> GetMaterialRatesByDateRange(
        //    [FromQuery] DateTime startDate, 
        //    [FromQuery] DateTime endDate)
        //{
        //    var response = await _materialRateService.GetMaterialRatesByDateRangeAsync(startDate, endDate);
        //    return Ok(response);
        //}

        //[HttpGet("previous-month/{locationId}")]
        //public async Task<ActionResult<ServiceResponse<List<MaterialRateDto>>>> GetPreviousMonthRates(int locationId)
        //{
        //    var response = await _materialRateService.GetPreviousMonthRatesAsync(locationId);
        //    return Ok(response);
        //}
    }
}