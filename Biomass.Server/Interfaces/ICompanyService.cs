using Biomass.Api.Model;
using Biomass.Server.Models;
using Biomass.Server.Models.Company;
using Microsoft.AspNetCore.Http;

namespace Biomass.Server.Interfaces
{
    public interface ICompanyService
    {
        Task<ServiceResponse<List<CompanyDto>>> GetAllCompaniesAsync();
        Task<ServiceResponse<CompanyDto>> GetCompanyByIdAsync(int id);
        Task<ServiceResponse<CompanyDto>> CreateCompanyAsync(CompanyDto request);
        Task<ServiceResponse<CompanyDto>> UpdateCompanyAsync(int id, UpdateCompanyRequest request);
        Task<ServiceResponse<bool>> DeleteCompanyAsync(int id);
        Task<ServiceResponse<string>> UpdateCompanyLogoAsync(int companyId, string logoPath);
    }
}
