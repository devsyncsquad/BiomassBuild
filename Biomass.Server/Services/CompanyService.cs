using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Company;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ApplicationDbContext _context;

        public CompanyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<List<CompanyDto>>> GetAllCompaniesAsync()
        {
            var response = new ServiceResponse<List<CompanyDto>>();

            try
            {
                var companies = await _context.Companies.ToListAsync();

                response.Result = companies.Select(c => new CompanyDto
                {
                    CompanyId = c.CompanyId,
                    CompanyName = c.CompanyName,
                    CompanyAddress = c.CompanyAddress,
                    NTN = c.NTN,
                    STRN = c.STRN,
                    PRA = c.PRA,
                    ContactPersonName = c.ContactPersonName,
                    ContactPersonPhone = c.ContactPersonPhone,
                    CompanyDescription = c.CompanyDescription,
                    Industry = c.Industry,
                    CompanySize = c.CompanySize,
                    Location = c.Location,
                    LogoPath = c.LogoPath,
                    CreatedDate = c.CreatedDate,
                    IsActive = c.IsActive
                }).ToList();

                response.Success = true;
                response.Message = "Companies retrieved successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving companies: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<CompanyDto>> GetCompanyByIdAsync(int companyId)
        {
            var response = new ServiceResponse<CompanyDto>();
            
            try
            {
                var company = await _context.Companies
                    .Where(c => c.CompanyId == companyId)
                    .Select(c => new CompanyDto
                    {
                        CompanyId = c.CompanyId,
                        CompanyName = c.CompanyName,
                        CompanyAddress = c.CompanyAddress,
                        NTN = c.NTN,
                        STRN = c.STRN,
                        PRA = c.PRA,
                        ContactPersonName = c.ContactPersonName,
                        ContactPersonPhone = c.ContactPersonPhone,
                        CompanyDescription = c.CompanyDescription,
                        Industry = c.Industry,
                        CompanySize = c.CompanySize,
                        Location = c.Location,
                        LogoPath = c.LogoPath,
                        CreatedDate = c.CreatedDate,
                        LastUpdatedOn = c.LastUpdatedOn,
                        IsActive = c.IsActive,
                        CreatedBy = c.CreatedBy,
                        LastUpdatedBy = c.LastUpdatedBy
                    })
                    .FirstOrDefaultAsync();

                if (company == null)
                {
                    response.Success = false;
                    response.Message = "Company not found";
                    return response;
                }

                response.Result = company;
                response.Success = true;
                response.Message = "Company retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving company: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<CompanyDto>> CreateCompanyAsync(CompanyDto request)
        {
            var response = new ServiceResponse<CompanyDto>();
            
            try
            {
                var company = new Company
                {
                    CompanyName = request.CompanyName,
                    CompanyAddress = request.CompanyAddress,
                    NTN = request.NTN,
                    STRN = request.STRN,
                    PRA = request.PRA,
                    ContactPersonName = request.ContactPersonName,
                    ContactPersonPhone = request.ContactPersonPhone,
                    CompanyDescription = request.CompanyDescription,
                    Industry = request.Industry,
                    CompanySize = request.CompanySize,
                    Location = request.Location,
                    LogoPath = request.LogoPath,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true,
                    CreatedBy = 1 // TODO: Get from current user context
                };

                _context.Companies.Add(company);
                await _context.SaveChangesAsync();

                response.Result = new CompanyDto
                {
                    CompanyId = company.CompanyId,
                    CompanyName = company.CompanyName,
                    CompanyAddress = company.CompanyAddress,
                    NTN = company.NTN,
                    STRN = company.STRN,
                    PRA = company.PRA,
                    ContactPersonName = company.ContactPersonName,
                    ContactPersonPhone = company.ContactPersonPhone,
                    CompanyDescription = company.CompanyDescription,
                    Industry = company.Industry,
                    CompanySize = company.CompanySize,
                    Location = company.Location,
                    LogoPath = company.LogoPath,
                    CreatedDate = company.CreatedDate,
                    LastUpdatedOn = company.LastUpdatedOn,
                    IsActive = company.IsActive,
                    CreatedBy = company.CreatedBy,
                    LastUpdatedBy = company.LastUpdatedBy
                };

                response.Success = true;
                response.Message = "Company created successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error creating company: {ex.Message}";
            }

            return response;
        }
       
        public async Task<ServiceResponse<CompanyDto>> UpdateCompanyAsync(int id, UpdateCompanyRequest request)
        {
            var response = new ServiceResponse<CompanyDto>();
            
            try
            {
                var company = await _context.Companies
                    .FirstOrDefaultAsync(c => c.CompanyId == request.CompanyId && c.IsActive);

                if (company == null)
                {
                    response.Success = false;
                    response.Message = "Company not found";
                    return response;
                }

                company.CompanyName = request.CompanyName;
                company.CompanyAddress = request.CompanyAddress;
                company.NTN = request.NTN;
                company.STRN = request.STRN;
                company.PRA = request.PRA;
                company.ContactPersonName = request.ContactPersonName;
                company.ContactPersonPhone = request.ContactPersonPhone;
                company.CompanyDescription = request.CompanyDescription;
                company.Industry = request.Industry;
                company.CompanySize = request.CompanySize;
                company.Location = request.Location;
                company.LogoPath = request.LogoPath;
                company.LastUpdatedOn = DateTime.UtcNow;
                company.LastUpdatedBy = 1; // TODO: Get from current user context

                await _context.SaveChangesAsync();

                response.Result = new CompanyDto
                {
                    CompanyId = company.CompanyId,
                    CompanyName = company.CompanyName,
                    CompanyAddress = company.CompanyAddress,
                    NTN = company.NTN,
                    STRN = company.STRN,
                    PRA = company.PRA,
                    ContactPersonName = company.ContactPersonName,
                    ContactPersonPhone = company.ContactPersonPhone,
                    CompanyDescription = company.CompanyDescription,
                    Industry = company.Industry,
                    CompanySize = company.CompanySize,
                    Location = company.Location,
                    LogoPath = company.LogoPath,
                    CreatedDate = company.CreatedDate,
                    LastUpdatedOn = company.LastUpdatedOn,
                    IsActive = company.IsActive,
                    CreatedBy = company.CreatedBy,
                    LastUpdatedBy = company.LastUpdatedBy
                };

                response.Success = true;
                response.Message = "Company updated successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error updating company: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteCompanyAsync(int companyId)
        {
            var response = new ServiceResponse<bool>();
            
            try
            {
                var company = await _context.Companies
                    .FirstOrDefaultAsync(c => c.CompanyId == companyId && c.IsActive);

                if (company == null)
                {
                    response.Success = false;
                    response.Message = "Company not found";
                    return response;
                }

                company.IsActive = false;
                company.LastUpdatedOn = DateTime.UtcNow;
                company.LastUpdatedBy = 1; // TODO: Get from current user context

                await _context.SaveChangesAsync();

                response.Result = true;
                response.Success = true;
                response.Message = "Company deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error deleting company: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> UpdateCompanyLogoAsync(int companyId, string logoPath)
        {
            var response = new ServiceResponse<bool>();
            
            try
            {
                var company = await _context.Companies
                    .FirstOrDefaultAsync(c => c.CompanyId == companyId && c.IsActive);

                if (company == null)
                {
                    response.Success = false;
                    response.Message = "Company not found";
                    return response;
                }

                // Update logo path
                company.LogoPath = logoPath;
                company.LastUpdatedOn = DateTime.UtcNow;
                company.LastUpdatedBy = 1; // TODO: Get from current user context

                await _context.SaveChangesAsync();

                response.Result = true;
                response.Success = true;
                response.Message = "Company logo updated successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error updating company logo: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<List<CompanyDto>>> SearchCompaniesAsync(string? searchTerm, string? industry, string? companySize, string? location)
        {
            var response = new ServiceResponse<List<CompanyDto>>();
            
            try
            {
                var query = _context.Companies.Where(c => c.IsActive);

                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    query = query.Where(c => 
                        c.CompanyName.Contains(searchTerm) || 
                        c.CompanyDescription.Contains(searchTerm) ||
                        c.ContactPersonName.Contains(searchTerm));
                }

                if (!string.IsNullOrWhiteSpace(industry))
                {
                    query = query.Where(c => c.Industry == industry);
                }

                if (!string.IsNullOrWhiteSpace(companySize))
                {
                    query = query.Where(c => c.CompanySize == companySize);
                }

                if (!string.IsNullOrWhiteSpace(location))
                {
                    query = query.Where(c => c.Location == location);
                }

                var companies = await query
                    .OrderByDescending(c => c.CreatedDate)
                    .Select(c => new CompanyDto
                    {
                        CompanyId = c.CompanyId,
                        CompanyName = c.CompanyName,
                        CompanyAddress = c.CompanyAddress,
                        NTN = c.NTN,
                        STRN = c.STRN,
                        PRA = c.PRA,
                        ContactPersonName = c.ContactPersonName,
                        ContactPersonPhone = c.ContactPersonPhone,
                        CompanyDescription = c.CompanyDescription,
                        Industry = c.Industry,
                        CompanySize = c.CompanySize,
                        Location = c.Location,
                        LogoPath = c.LogoPath,
                        CreatedDate = c.CreatedDate,
                        LastUpdatedOn = c.LastUpdatedOn,
                        IsActive = c.IsActive,
                        CreatedBy = c.CreatedBy,
                        LastUpdatedBy = c.LastUpdatedBy
                    })
                    .ToListAsync();

                response.Result = companies;
                response.Success = true;
                response.Message = "Companies retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error searching companies: {ex.Message}";
            }

            return response;
        }

        Task<ServiceResponse<string>> ICompanyService.UpdateCompanyLogoAsync(int companyId, string logoPath)
        {
            throw new NotImplementedException();
        }
    }
} 