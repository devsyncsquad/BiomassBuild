using Biomass.Server.Models.Dispatch;

namespace Biomass.Server.Interfaces
{
    /// <summary>
    /// Interface for DispatchReceipt service operations
    /// </summary>
    public interface IDispatchReceiptService
    {
        /// <summary>
        /// Creates a new dispatch receipt
        /// </summary>
        /// <param name="request">The dispatch receipt creation request</param>
        /// <returns>The ID of the created receipt</returns>
        Task<long> CreateDispatchReceiptAsync(CreateDispatchReceiptRequest request);

        /// <summary>
        /// Updates an existing dispatch receipt
        /// </summary>
        /// <param name="id">The receipt ID to update</param>
        /// <param name="request">The dispatch receipt update request</param>
        /// <returns>The updated dispatch receipt DTO, or null if not found</returns>
        Task<DispatchReceiptDto?> UpdateDispatchReceiptAsync(long id, UpdateDispatchReceiptRequest request);

        /// <summary>
        /// Gets a dispatch receipt by ID
        /// </summary>
        /// <param name="id">The receipt ID</param>
        /// <returns>The dispatch receipt DTO, or null if not found</returns>
        Task<DispatchReceiptDto?> GetDispatchReceiptByIdAsync(long id);

        /// <summary>
        /// Gets all dispatch receipts
        /// </summary>
        /// <returns>List of dispatch receipt DTOs</returns>
        Task<List<DispatchReceiptDto>> GetDispatchReceiptsAsync();

        /// <summary>
        /// Gets dispatch receipts by dispatch ID
        /// </summary>
        /// <param name="dispatchId">The dispatch ID</param>
        /// <returns>List of dispatch receipt DTOs</returns>
        Task<List<DispatchReceiptDto>> GetDispatchReceiptsByDispatchIdAsync(int dispatchId);

        /// <summary>
        /// Deletes a dispatch receipt
        /// </summary>
        /// <param name="id">The receipt ID to delete</param>
        /// <returns>True if deleted successfully, false if not found</returns>
        Task<bool> DeleteDispatchReceiptAsync(long id);

        /// <summary>
        /// Processes a payment for a dispatch receipt
        /// </summary>
        /// <param name="receiptId">The receipt ID</param>
        /// <param name="request">The payment processing request</param>
        /// <returns>The payment processing response</returns>
        Task<ProcessPaymentResponse> ProcessPaymentAsync(long receiptId, ProcessPaymentRequest request);

        /// <summary>
        /// Gets payment history for a dispatch receipt
        /// </summary>
        /// <param name="receiptId">The receipt ID</param>
        /// <returns>List of payment log DTOs</returns>
        Task<List<DispatchReceiptsLogDto>> GetPaymentHistoryAsync(long receiptId);
    }
}
