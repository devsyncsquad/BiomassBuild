using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Services;
using Biomass.Server.Models.Banking;
using Biomass.Api.Model;
using Biomass.Server.Interfaces;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class BankingController : ControllerBase
    {
        private readonly IBankingService _bankingService;

        public BankingController(IBankingService bankingService)
        {
            _bankingService = bankingService;
        }

        /// <summary>
        /// Get all bank accounts
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<BankAccountDto>>>> GetAllBankAccounts()
        {
            var response = await _bankingService.GetAllBankAccountsAsync();
            return Ok(response);
        }

        /// <summary>
        /// Get bank account by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<BankAccountDto>>> GetBankAccountById(int id)
        {
            var response = await _bankingService.GetBankAccountByIdAsync(id);
            if (!response.Success)
                return NotFound(response);
            return Ok(response);
        }

        /// <summary>
        /// Create a new bank account
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ServiceResponse<BankAccountDto>>> CreateBankAccount([FromBody] CreateBankAccountRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _bankingService.CreateBankAccountAsync(request);
            if (!response.Success)
                return BadRequest(response);
            return CreatedAtAction(nameof(GetBankAccountById), new { id = response.Result.BankAccountId }, response);
        }

        /// <summary>
        /// Update an existing bank account
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<BankAccountDto>>> UpdateBankAccount(int id, [FromBody] UpdateBankAccountRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != request.BankAccountId)
                return BadRequest("ID mismatch");

            var response = await _bankingService.UpdateBankAccountAsync(id, request);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        /// <summary>
        /// Delete a bank account
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteBankAccount(int id)
        {
            var response = await _bankingService.DeleteBankAccountAsync(id);
            if (!response.Success)
                return BadRequest(response);
            return Ok(response);
        }

        /// <summary>
        /// Search bank accounts with filters and pagination
        /// </summary>
        //[HttpGet("search")]
        //public async Task<ActionResult<ServiceResponse<List<BankAccountDto>>>> SearchBankAccounts([FromQuery] BankAccountSearchRequest request)
        //{
        //    var response = await _bankingService.SearchBankAccountsAsync(request);
        //    return Ok(response);
        //}

        /// <summary>
        /// Get total count of bank accounts
        /// </summary>
        //[HttpGet("count")]
        //public async Task<ActionResult<ServiceResponse<int>>> GetBankAccountCount()
        //{
        //    var response = await _bankingService.GetBankAccountCountAsync();
        //    return Ok(response);
        //}
    }
}
