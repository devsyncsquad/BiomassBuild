using Microsoft.EntityFrameworkCore;
using Biomass.Server.Data;
using Biomass.Server.Models.Customer;
using Biomass.Server.Models;
using Biomass.Api.Model;
using Biomass.Server.Services.Interfaces;

namespace Biomass.Server.Services
{
    public class MaterialRateService : IMaterialRateService
    {
        private readonly ApplicationDbContext _context;

        public MaterialRateService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<List<MaterialRateDto>>> GetAllMaterialRatesAsync()
        {
            var response = new ServiceResponse<List<MaterialRateDto>>();

            try
            {
                var materialRates = await _context.MaterialRates
                    .Include(mr => mr.Customer)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = $"{mr.Customer.FirstName} {mr.Customer.LastName}"
                    })
                    .ToListAsync();

                response.Result = materialRates;
                response.Success = true;
                response.Message = "Material rates retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving material rates: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByCustomerIdAsync(int customerId)
        {
            var response = new ServiceResponse<List<MaterialRateDto>>();

            try
            {
                var materialRates = await _context.MaterialRates
                    .Include(mr => mr.Customer)
                    .Where(mr => mr.CustomerId == customerId)
                    .OrderByDescending(mr => mr.EffectiveDate)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = $"{mr.Customer.FirstName} {mr.Customer.LastName}"
                    })
                    .ToListAsync();

                response.Result = materialRates;
                response.Success = true;
                response.Message = "Material rates retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving material rates: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<MaterialRateDto>> GetMaterialRateByIdAsync(int rateId)
        {
            var response = new ServiceResponse<MaterialRateDto>();

            try
            {
                var materialRate = await _context.MaterialRates
                    .Include(mr => mr.Customer)
                    .Where(mr => mr.RateId == rateId)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = $"{mr.Customer.FirstName} {mr.Customer.LastName}"
                    })
                    .FirstOrDefaultAsync();

                if (materialRate == null)
                {
                    response.Success = false;
                    response.Message = "Material rate not found";
                    return response;
                }

                response.Result = materialRate;
                response.Success = true;
                response.Message = "Material rate retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving material rate: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<MaterialRateDto>> CreateMaterialRateAsync(CreateMaterialRateRequest request)
        {
            var response = new ServiceResponse<MaterialRateDto>();

            try
            {
                var materialRate = new MaterialRate
                {
                    CustomerId = request.CustomerId,
                    EffectiveDate = request.EffectiveDate,
                    CompanyRate = request.CompanyRate,
                    TransporterRate = request.TransporterRate,
                    Route = request.Route,
                    MaterialType = request.MaterialType,
                    Status = "active",
                    CreatedBy = 1, // TODO: Get from current user context
                    CreatedOn = DateTime.UtcNow
                };

                _context.MaterialRates.Add(materialRate);
                await _context.SaveChangesAsync();

                // Get the created material rate with navigation properties
                var createdMaterialRate = await _context.MaterialRates
                    .Include(mr => mr.Customer)
                    .Where(mr => mr.RateId == materialRate.RateId)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = $"{mr.Customer.FirstName} {mr.Customer.LastName}"
                    })
                    .FirstOrDefaultAsync();

                response.Result = createdMaterialRate!;
                response.Success = true;
                response.Message = "Material rate created successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error creating material rate: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<MaterialRateDto>> UpdateMaterialRateAsync(int rateId, UpdateMaterialRateRequest request)
        {
            var response = new ServiceResponse<MaterialRateDto>();

            try
            {
                var materialRate = await _context.MaterialRates
                    .FirstOrDefaultAsync(mr => mr.RateId == rateId);

                if (materialRate == null)
                {
                    response.Success = false;
                    response.Message = "Material rate not found";
                    return response;
                }

                materialRate.CompanyRate = request.CompanyRate;
                materialRate.TransporterRate = request.TransporterRate;
                materialRate.Route = request.Route;
                materialRate.MaterialType = request.MaterialType;
                materialRate.Status = request.Status;

                await _context.SaveChangesAsync();

                // Get the updated material rate with navigation properties
                var updatedMaterialRate = await _context.MaterialRates
                    .Include(mr => mr.Customer)
                    .Where(mr => mr.RateId == rateId)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = $"{mr.Customer.FirstName} {mr.Customer.LastName}"
                    })
                    .FirstOrDefaultAsync();

                response.Result = updatedMaterialRate!;
                response.Success = true;
                response.Message = "Material rate updated successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error updating material rate: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteMaterialRateAsync(int rateId)
        {
            var response = new ServiceResponse<bool>();

            try
            {
                var materialRate = await _context.MaterialRates
                    .FirstOrDefaultAsync(mr => mr.RateId == rateId);

                if (materialRate == null)
                {
                    response.Success = false;
                    response.Message = "Material rate not found";
                    return response;
                }

                _context.MaterialRates.Remove(materialRate);
                await _context.SaveChangesAsync();

                response.Result = true;
                response.Success = true;
                response.Message = "Material rate deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error deleting material rate: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var response = new ServiceResponse<List<MaterialRateDto>>();

            try
            {
                var materialRates = await _context.MaterialRates
                    .Include(mr => mr.Customer)
                    .Where(mr => mr.EffectiveDate >= startDate && mr.EffectiveDate <= endDate)
                    .OrderByDescending(mr => mr.EffectiveDate)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = $"{mr.Customer.FirstName} {mr.Customer.LastName}"
                    })
                    .ToListAsync();

                response.Result = materialRates;
                response.Success = true;
                response.Message = "Material rates retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving material rates: {ex.Message}";
            }

            return response;
        }

        public Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByLocationIdAsync(int locationId)
        {
            throw new NotImplementedException();
        }
    }
}