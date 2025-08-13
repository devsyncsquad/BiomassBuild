using Biomass.Server.Models.Customer;
using Biomass.Server.Models;
using Biomass.Api.Model;

namespace Biomass.Server.Interfaces
{
    public interface ICustomerService
    {
        Task<ServiceResponse<List<CustomerDto>>> GetAllCustomersAsync();
        Task<ServiceResponse<CustomerDto>> GetCustomerByIdAsync(int customerId);
        Task<ServiceResponse<CustomerDto>> CreateCustomerAsync(CreateCustomerRequest request);
        Task<ServiceResponse<CustomerDto>> UpdateCustomerAsync(int customerId, UpdateCustomerRequest request);
        Task<ServiceResponse<bool>> DeleteCustomerAsync(int customerId);
        Task<ServiceResponse<List<CustomerDto>>> SearchCustomersAsync(string searchTerm, string status = "all");
        Task<ServiceResponse<int>> GetCustomerCountAsync();
    }
}
