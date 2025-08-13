using Biomass.Server.Models.Customer;
using Biomass.Server.Models;
using Biomass.Api.Model;

namespace Biomass.Server.Interfaces
{
    public interface ICustomerLocationService
    {
        Task<ServiceResponse<List<CustomerLocationDto>>> GetAllLocationsAsync();
        Task<ServiceResponse<List<CustomerLocationDto>>> GetLocationsByCustomerIdAsync(int customerId);
        Task<ServiceResponse<CustomerLocationDto>> GetLocationByIdAsync(int locationId);
        Task<ServiceResponse<CustomerLocationDto>> CreateLocationAsync(CreateCustomerLocationRequest request);
        Task<ServiceResponse<CustomerLocationDto>> UpdateLocationAsync(int locationId, UpdateCustomerLocationRequest request);
        Task<ServiceResponse<bool>> DeleteLocationAsync(int locationId);
        Task<ServiceResponse<List<CustomerLocationDto>>> SearchLocationsAsync(string searchTerm, string status = "all");
        Task<ServiceResponse<int>> GetLocationCountAsync(int customerId);
    }
}
