using Biomass.Server.Models.Driver;

namespace Biomass.Server.Interfaces
{
    public interface IDriverService
    {
        Task<List<DriverDto>> GetDriversAsync();
        Task<DriverDto?> GetDriverByIdAsync(int id);
        Task<Driver> CreateDriverAsync(CreateDriverRequest request);
        Task<Driver?> UpdateDriverAsync(int id, UpdateDriverRequest request);
        Task<bool> DeleteDriverAsync(int id);
    }
}