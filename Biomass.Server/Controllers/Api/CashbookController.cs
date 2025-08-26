using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Interfaces;
using Biomass.Api.Model;
using Biomass.Server.Models.Cashbook;

namespace Biomass.Server.Controllers.Api
{
	[ApiController]
	[Route("api/[controller]")]
	public class CashbookController : ControllerBase
	{
		private readonly ICashbookService _service;

		public CashbookController(ICashbookService service)
		{
			_service = service;
		}

        
        [HttpPost("CreateCashbookEntry")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateCashbookEntry([FromForm] CashbookEntryDto dto)
        {
            var id = await _service.SaveCashbookEntryAsync(dto);
            return Ok(new { CashId = id });
        }


        [HttpGet("GetCashbookById/{cashId}")]
		public async Task<IActionResult> GetCashbookById(long cashId)
		{
			var result = await _service.GetCashbookByIdAsync(cashId);
			if (!result.Success) return NotFound(result);
			return Ok(result);
		}

		[HttpPut("CancelEntry")]
		public async Task<IActionResult> CancelEntry(long cashId, [FromBody] CancelCashbookRequest request)
		{
			var result = await _service.CancelCashbookEntryAsync(cashId, request.CancellationReason);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetWalletBalanceByEmployeeId")]
		public async Task<IActionResult> GetWalletBalance(int employeeId)
		{
			var result = await _service.GetWalletBalanceAsync(employeeId);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetEmployeeTransactionsByDays")]
		public async Task<IActionResult> GetEmployeeTransactionsByDays(
			[FromQuery] int employeeId, 
			[FromQuery] int days, 
			[FromQuery] int page = 1, 
			[FromQuery] int pageSize = 20)
		{
			var result = await _service.GetEmployeeTransactionsAsync(employeeId, days, page, pageSize);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetEmployeeTransactionsLast7Days")]
		public async Task<IActionResult> GetEmployeeTransactionsLast7Days(
			[FromQuery] int employeeId, 
			[FromQuery] int page = 1, 
			[FromQuery] int pageSize = 20)
		{
			var result = await _service.GetEmployeeTransactionsLast7DaysAsync(employeeId, page, pageSize);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetEmployeeTransactionsLast14Days")]
		public async Task<IActionResult> GetEmployeeTransactionsLast14Days(
			[FromQuery] int employeeId, 
			[FromQuery] int page = 1, 
			[FromQuery] int pageSize = 20)
		{
			var result = await _service.GetEmployeeTransactionsLast14DaysAsync(employeeId, page, pageSize);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetEmployeeTransactionsLastMonth")]
		public async Task<IActionResult> GetEmployeeTransactionsLastMonth(
			[FromQuery] int employeeId, 
			[FromQuery] int page = 1, 
			[FromQuery] int pageSize = 20)
		{
			var result = await _service.GetEmployeeTransactionsLastMonthAsync(employeeId, page, pageSize);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpGet("GetPendingTransactionsByEmployee")]
		public async Task<IActionResult> GetPendingTransactionsByEmployee(
			[FromQuery] int employeeId, 
			[FromQuery] string status)
		{
			var result = await _service.GetPendingTransactionsByEmployeeAsync(employeeId, status);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}

		[HttpPut("UpdateStatus")]
		public async Task<IActionResult> UpdateStatus(long cashId, string status)
		{
			var result = await _service.UpdateCashbookStatusAsync(cashId, status);
			if (!result.Success) return BadRequest(result);
			return Ok(result);
		}
	}
}
