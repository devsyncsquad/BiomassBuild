using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Dispatch;
using Microsoft.AspNetCore.Mvc;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/dispatch-receipts")]
    public class DispatchReceiptsController : ControllerBase
    {
        private readonly IDispatchReceiptService _dispatchReceiptService;

        public DispatchReceiptsController(IDispatchReceiptService dispatchReceiptService)
        {
            _dispatchReceiptService = dispatchReceiptService;
        }

        /// <summary>
        /// Creates a new dispatch receipt
        /// </summary>
        /// <param name="request">The dispatch receipt creation request</param>
        /// <returns>The created dispatch receipt ID</returns>
        [HttpPost]
        public async Task<ActionResult<ServiceResponse<long>>> CreateDispatchReceipt([FromBody] CreateDispatchReceiptRequest request)
        {
            try
            {
                var receiptId = await _dispatchReceiptService.CreateDispatchReceiptAsync(request);
                return CreatedAtAction(nameof(GetDispatchReceipt), new { id = receiptId }, new ServiceResponse<long>
                {
                    Result = receiptId,
                    Message = "Dispatch receipt created successfully",
                    Success = true
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ServiceResponse<long>
                {
                    Message = ex.Message,
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<long>
                {
                    Message = $"An error occurred while creating the dispatch receipt: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Updates an existing dispatch receipt
        /// </summary>
        /// <param name="id">The receipt ID to update</param>
        /// <param name="request">The dispatch receipt update request</param>
        /// <returns>The updated dispatch receipt</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<DispatchReceiptDto>>> UpdateDispatchReceipt(long id, [FromBody] UpdateDispatchReceiptRequest request)
        {
            try
            {
                var dispatchReceipt = await _dispatchReceiptService.UpdateDispatchReceiptAsync(id, request);
                if (dispatchReceipt == null)
                {
                    return NotFound(new ServiceResponse<DispatchReceiptDto>
                    {
                        Message = "Dispatch receipt not found",
                        Success = false
                    });
                }

                return Ok(new ServiceResponse<DispatchReceiptDto>
                {
                    Result = dispatchReceipt,
                    Message = "Dispatch receipt updated successfully",
                    Success = true
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ServiceResponse<DispatchReceiptDto>
                {
                    Message = ex.Message,
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<DispatchReceiptDto>
                {
                    Message = $"An error occurred while updating the dispatch receipt: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Gets a dispatch receipt by ID
        /// </summary>
        /// <param name="id">The receipt ID</param>
        /// <returns>The dispatch receipt</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<DispatchReceiptDto>>> GetDispatchReceipt(long id)
        {
            try
            {
                var dispatchReceipt = await _dispatchReceiptService.GetDispatchReceiptByIdAsync(id);
                if (dispatchReceipt == null)
                {
                    return NotFound(new ServiceResponse<DispatchReceiptDto>
                    {
                        Message = "Dispatch receipt not found",
                        Success = false
                    });
                }

                return Ok(new ServiceResponse<DispatchReceiptDto>
                {
                    Result = dispatchReceipt,
                    Message = "Dispatch receipt retrieved successfully",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<DispatchReceiptDto>
                {
                    Message = $"An error occurred while retrieving the dispatch receipt: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Gets all dispatch receipts
        /// </summary>
        /// <returns>List of dispatch receipts</returns>
        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<DispatchReceiptDto>>>> GetDispatchReceipts()
        {
            try
            {
                var dispatchReceipts = await _dispatchReceiptService.GetDispatchReceiptsAsync();
                return Ok(new ServiceResponse<List<DispatchReceiptDto>>
                {
                    Result = dispatchReceipts,
                    Message = "Dispatch receipts retrieved successfully",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<DispatchReceiptDto>>
                {
                    Message = $"An error occurred while retrieving dispatch receipts: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Gets dispatch receipts by dispatch ID
        /// </summary>
        /// <param name="dispatchId">The dispatch ID</param>
        /// <returns>List of dispatch receipts for the specified dispatch</returns>
        [HttpGet("by-dispatch/{dispatchId}")]
        public async Task<ActionResult<ServiceResponse<List<DispatchReceiptDto>>>> GetDispatchReceiptsByDispatchId(int dispatchId)
        {
            try
            {
                var dispatchReceipts = await _dispatchReceiptService.GetDispatchReceiptsByDispatchIdAsync(dispatchId);
                return Ok(new ServiceResponse<List<DispatchReceiptDto>>
                {
                    Result = dispatchReceipts,
                    Message = $"Found {dispatchReceipts.Count} dispatch receipts for dispatch {dispatchId}",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<DispatchReceiptDto>>
                {
                    Message = $"An error occurred while retrieving dispatch receipts: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Deletes a dispatch receipt
        /// </summary>
        /// <param name="id">The receipt ID to delete</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteDispatchReceipt(long id)
        {
            try
            {
                var result = await _dispatchReceiptService.DeleteDispatchReceiptAsync(id);
                if (!result)
                {
                    return NotFound(new ServiceResponse<bool>
                    {
                        Message = "Dispatch receipt not found",
                        Success = false
                    });
                }

                return Ok(new ServiceResponse<bool>
                {
                    Result = true,
                    Message = "Dispatch receipt deleted successfully",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<bool>
                {
                    Message = $"An error occurred while deleting the dispatch receipt: {ex.Message}",
                    Success = false
                });
            }
        }
    }
}
