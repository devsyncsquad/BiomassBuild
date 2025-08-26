using Biomass.Server.Models.Vehicle;

namespace Biomass.Server.Interfaces
{
    public interface IVehicleService
    {
        Task<List<VehicleDto>> GetVehiclesAsync();
        Task<VehicleDto?> GetVehicleByIdAsync(int id);
        Task<VehicleDto> CreateVehicleWithDriverAsync(CreateVehicleRequest request);
        Task<VehicleDto?> UpdateVehicleWithDriverAsync(int id, UpdateVehicleRequest request);
        Task<bool> DeleteVehicleAsync(int id);
    }
}
