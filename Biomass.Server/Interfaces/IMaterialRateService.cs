using Biomass.Api.Model;
using Biomass.Server.Models.Customer;

namespace Biomass.Server.Services.Interfaces
{
    public interface IMaterialRateService
    {
        Task<ServiceResponse<List<MaterialRateDto>>> GetAllMaterialRatesAsync();
        Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByCustomerIdAsync(int customerId);
        Task<ServiceResponse<MaterialRateDto>> GetMaterialRateByIdAsync(int rateId);
        Task<ServiceResponse<MaterialRateDto>> CreateMaterialRateAsync(CreateMaterialRateRequest request);
        Task<ServiceResponse<MaterialRateDto>> UpdateMaterialRateAsync(int rateId, UpdateMaterialRateRequest request);
        Task<ServiceResponse<bool>> DeleteMaterialRateAsync(int rateId);
        Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByLocationIdAsync(int locationId);
        Task<ServiceResponse<List<MaterialRateDto>>> CheckExistingActiveRatesAsync(int customerId, int locationId, string materialType, DateTime effectiveDate);
    }
}