using Biomass.Server.Models.Dispatch;

namespace Biomass.Server.Interfaces
{
    public interface IDispatchService
    {
        Task<List<DispatchDto>> GetDispatchesAsync();
        Task<DispatchDto?> GetDispatchByIdAsync(int id);
        Task<DispatchDto> CreateDispatchAsync(CreateDispatchRequest request);
        Task<DispatchDto?> UpdateDispatchAsync(int id, UpdateDispatchRequest request);
        Task<bool> DeleteDispatchAsync(int id);
    }
}
