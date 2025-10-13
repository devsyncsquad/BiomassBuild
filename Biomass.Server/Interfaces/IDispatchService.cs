using Biomass.Server.Models.Dispatch;

namespace Biomass.Server.Interfaces
{
    public interface IDispatchService
    {
        Task<List<DispatchDto>> GetDispatchesAsync();
        Task<DispatchDto?> GetDispatchByIdAsync(int id);
        Task<int> CreateDispatchAsync(CreateDispatchRequest request);
        Task<DispatchDto?> UpdateDispatchAsync(int id, UpdateDispatchRequest request);
        Task<bool> DeleteDispatchAsync(int id);

        Task<List<DispatchDto>> GetDispatchesByUserAndStatusAsync(int userId, string status);
        Task<List<DispatchDto>> GetDispatchesBySlipNumberAsync(string slipNumber);

        // Dispatch Receipts (Pending Payments)
        Task<List<VDispatchReceiptDto>> GetPendingPaymentsAsync();
        Task<List<VDispatchReceiptDto>> GetPendingPaymentsByUserAsync(int userId);
        Task<int> GetPendingPaymentsCountAsync();
        Task<int> GetPendingPaymentsCountByUserAsync(int userId);
    }
}
