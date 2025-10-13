using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models;
using Biomass.Server.Models.Dispatch;
using Microsoft.AspNetCore.Mvc;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/dispatches")]
    public class DispatchesController : ControllerBase
    {
        private readonly IDispatchService _dispatchService;

        public DispatchesController(IDispatchService dispatchService)
        {
            _dispatchService = dispatchService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<DispatchDto>>>> GetDispatches()
        {
            var dispatches = await _dispatchService.GetDispatchesAsync();
            return Ok(new ServiceResponse<List<DispatchDto>>
            {
                Result = dispatches,
                Message = "Dispatches retrieved successfully",
                Success = true
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<DispatchDto>>> GetDispatch(int id)
        {
            var dispatch = await _dispatchService.GetDispatchByIdAsync(id);
            if (dispatch == null)
            {
                return NotFound(new ServiceResponse<DispatchDto>
                {
                    Message = "Dispatch not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<DispatchDto>
            {
                Result = dispatch,
                Message = "Dispatch retrieved successfully",
                Success = true
            });
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ServiceResponse<int>>> CreateDispatch([FromForm] CreateDispatchRequest request)
        {
            try
            {
                var dispatchId = await _dispatchService.CreateDispatchAsync(request);
                return CreatedAtAction(nameof(GetDispatch), new { id = dispatchId }, new ServiceResponse<int>
                {
                    Result = dispatchId,
                    Message = "Dispatch created successfully",
                    Success = true
                });
            }
            catch (InvalidOperationException ex)
            {
                // Business logic errors (e.g., slip number exists, invalid vendor, etc.)
                return BadRequest(new ServiceResponse<int>
                {
                    Message = ex.Message,
                    Success = false
                });
            }
            catch (Exception ex)
            {
                // Log the full exception for debugging
                Console.WriteLine($"❌ Error creating dispatch: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                
                return StatusCode(500, new ServiceResponse<int>
                {
                    Message = $"Failed to create dispatch: {ex.Message}",
                    Success = false
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<DispatchDto>>> UpdateDispatch(int id, [FromBody] UpdateDispatchRequest request)
        {
            var dispatch = await _dispatchService.UpdateDispatchAsync(id, request);
            if (dispatch == null)
            {
                return NotFound(new ServiceResponse<DispatchDto>
                {
                    Message = "Dispatch not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<DispatchDto>
            {
                Result = dispatch,
                Message = "Dispatch updated successfully",
                Success = true
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteDispatch(int id)
        {
            var result = await _dispatchService.DeleteDispatchAsync(id);
            if (!result)
            {
                return NotFound(new ServiceResponse<bool>
                {
                    Message = "Dispatch not found",
                    Success = false
                });
            }

            return Ok(new ServiceResponse<bool>
            {
                Result = true,
                Message = "Dispatch deleted successfully",
                Success = true
            });
        }

        [HttpGet("user/{userId}/status/{status}")]
        public async Task<ActionResult<ServiceResponse<List<DispatchDto>>>> GetDispatchesByUserAndStatus(int userId, string status)
        {
            var dispatches = await _dispatchService.GetDispatchesByUserAndStatusAsync(userId, status);

            if (!dispatches.Any())
            {
                return Ok(new ServiceResponse<List<DispatchDto>>
                {
                    Result = dispatches,
                    Message = "No dispatches found for the specified user and status",
                    Success = true
                });
            }

            return Ok(new ServiceResponse<List<DispatchDto>>
            {
                Result = dispatches,
                Message = $"Found {dispatches.Count} dispatches for user {userId} with status '{status}'",
                Success = true
            });
        }

        [HttpGet("dispatchedBySlipNumber/{slipNumber}")]
        public async Task<ActionResult<ServiceResponse<List<DispatchDto>>>> GetDispatchesBySlipNumber(string slipNumber)
        {
            var dispatches = await _dispatchService.GetDispatchesBySlipNumberAsync(slipNumber);

            if (!dispatches.Any())
            {
                return Ok(new ServiceResponse<List<DispatchDto>>
                {
                    Result = dispatches,
                    Message = "No dispatches found for the specified slip number",
                    Success = true
                });
            }

            return Ok(new ServiceResponse<List<DispatchDto>>
            {
                Result = dispatches,
                Message = $"Found {dispatches.Count} dispatch(es) with slip number '{slipNumber}'",
                Success = true
            });
        }

        // ========================================
        // PENDING PAYMENTS ENDPOINTS
        // ========================================

        /// <summary>
        /// Get all pending payments (dispatch receipts with status 'Received' and not yet posted)
        /// </summary>
        [HttpGet("pending-payments")]
        public async Task<ActionResult<ServiceResponse<List<VDispatchReceiptDto>>>> GetPendingPayments()
        {
            try
            {
                var pendingPayments = await _dispatchService.GetPendingPaymentsAsync();
                return Ok(new ServiceResponse<List<VDispatchReceiptDto>>
                {
                    Result = pendingPayments,
                    Message = $"Found {pendingPayments.Count} pending payments",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error fetching pending payments: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                
                return StatusCode(500, new ServiceResponse<List<VDispatchReceiptDto>>
                {
                    Message = $"Failed to fetch pending payments: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Get pending payments by user ID
        /// </summary>
        [HttpGet("pending-payments/user/{userId}")]
        public async Task<ActionResult<ServiceResponse<List<VDispatchReceiptDto>>>> GetPendingPaymentsByUser(int userId)
        {
            try
            {
                var pendingPayments = await _dispatchService.GetPendingPaymentsByUserAsync(userId);
                return Ok(new ServiceResponse<List<VDispatchReceiptDto>>
                {
                    Result = pendingPayments,
                    Message = $"Found {pendingPayments.Count} pending payments for user {userId}",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error fetching pending payments for user {userId}: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                
                return StatusCode(500, new ServiceResponse<List<VDispatchReceiptDto>>
                {
                    Message = $"Failed to fetch pending payments: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Get count of all pending payments
        /// </summary>
        [HttpGet("pending-payments/count")]
        public async Task<ActionResult<ServiceResponse<int>>> GetPendingPaymentsCount()
        {
            try
            {
                var count = await _dispatchService.GetPendingPaymentsCountAsync();
                return Ok(new ServiceResponse<int>
                {
                    Result = count,
                    Message = $"Total pending payments: {count}",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error counting pending payments: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                
                return StatusCode(500, new ServiceResponse<int>
                {
                    Message = $"Failed to count pending payments: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Get count of pending payments by user ID
        /// </summary>
        [HttpGet("pending-payments/count/user/{userId}")]
        public async Task<ActionResult<ServiceResponse<int>>> GetPendingPaymentsCountByUser(int userId)
        {
            try
            {
                var count = await _dispatchService.GetPendingPaymentsCountByUserAsync(userId);
                return Ok(new ServiceResponse<int>
                {
                    Result = count,
                    Message = $"User {userId} has {count} pending payments",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error counting pending payments for user {userId}: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                
                return StatusCode(500, new ServiceResponse<int>
                {
                    Message = $"Failed to count pending payments: {ex.Message}",
                    Success = false
                });
            }
        }
    }
}
