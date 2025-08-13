using Biomass.Api.Model;
using Biomass.Server.Models;
using Biomass.Server.Models.Customer;

namespace Biomass.Server.Services.Interfaces
{
    public interface IMaterialRateService
    {
        Task<ServiceResponse<List<MaterialRateDto>>> GetAllMaterialRatesAsync();
        Task<ServiceResponse<MaterialRateDto>> GetMaterialRateByIdAsync(int id);
        Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByCustomerIdAsync(int customerId);
        Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByLocationIdAsync(int locationId);
        Task<ServiceResponse<MaterialRateDto>> CreateMaterialRateAsync(CreateMaterialRateRequest request);
        Task<ServiceResponse<MaterialRateDto>> UpdateMaterialRateAsync(int id, UpdateMaterialRateRequest request);
        Task<ServiceResponse<bool>> DeleteMaterialRateAsync(int id);
    }
}