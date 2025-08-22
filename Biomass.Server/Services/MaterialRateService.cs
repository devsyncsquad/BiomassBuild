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
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        LocationId = mr.LocationId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                        
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedBy = mr.CreatedBy,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = "Customer", // Default value
                        LocationName = "Location", // Default value
                        LocationCode = "LOC" // Default value
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
                    .Where(mr => mr.CustomerId == customerId)
                    .OrderByDescending(mr => mr.EffectiveDate)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        LocationId = mr.LocationId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                      
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedBy = mr.CreatedBy,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = "Customer", // Default value
                        LocationName = "Location", // Default value
                        LocationCode = "LOC" // Default value
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
                    .Where(mr => mr.RateId == rateId)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        LocationId = mr.LocationId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                      
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedBy = mr.CreatedBy,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = "Customer", // Default value
                        LocationName = "Location", // Default value
                        LocationCode = "LOC" // Default value
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
                // First, deactivate any existing active rates for the same customer, location, and material type
                await DeactivateExistingRatesAsync(request.CustomerId, request.LocationId, request.MaterialType, request.EffectiveDate);

                var materialRate = new MaterialRate
                {
                    CustomerId = request.CustomerId,
                    LocationId = request.LocationId,
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
                    .Where(mr => mr.RateId == materialRate.RateId)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        LocationId = mr.LocationId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                     
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedBy = mr.CreatedBy,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = "Customer", // Default value
                        LocationName = "Location", // Default value
                        LocationCode = "LOC" // Default value
                    })
                    .FirstOrDefaultAsync();

                response.Result = createdMaterialRate!;
                response.Success = true;
                response.Message = "Material rate created successfully. Any existing active rates for the same combination have been automatically deactivated.";
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

                // Get the updated material rate
                var updatedMaterialRate = await _context.MaterialRates
                    .Where(mr => mr.RateId == rateId)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        LocationId = mr.LocationId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                       
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedBy = mr.CreatedBy,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = "Customer", // Default value
                        LocationName = "Location", // Default value
                        LocationCode = "LOC" // Default value
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
                    .Where(mr => mr.EffectiveDate >= startDate && mr.EffectiveDate <= endDate)
                    .OrderByDescending(mr => mr.EffectiveDate)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        LocationId = mr.LocationId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                       
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedBy = mr.CreatedBy,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = "Customer", // Default value
                        LocationName = "Location", // Default value
                        LocationCode = "LOC" // Default value
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

        public async Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByLocationIdAsync(int locationId)
        {
            var response = new ServiceResponse<List<MaterialRateDto>>();

            try
            {
                var materialRates = await _context.MaterialRates
                    .Where(mr => mr.LocationId == locationId)
                    .OrderByDescending(mr => mr.EffectiveDate)
                    .Select(mr => new MaterialRateDto
                    {
                        RateId = mr.RateId,
                        CustomerId = mr.CustomerId,
                        LocationId = mr.LocationId,
                        EffectiveDate = mr.EffectiveDate,
                        CompanyRate = mr.CompanyRate,
                        TransporterRate = mr.TransporterRate,
                       
                        Route = mr.Route,
                        MaterialType = mr.MaterialType,
                        Status = mr.Status,
                        CreatedBy = mr.CreatedBy,
                        CreatedOn = mr.CreatedOn,
                        CustomerName = "Customer", // Default value
                        LocationName = "Location", // Default value
                        LocationCode = "LOC" // Default value
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

        public async Task<ServiceResponse<List<MaterialRateDto>>> CheckExistingActiveRatesAsync(int customerId, int locationId, string materialType, DateTime effectiveDate)
        {
            var response = new ServiceResponse<List<MaterialRateDto>>();

            try
            {
                // Convert the input date to a range for comparison
                var dayOfMonth = effectiveDate.Day;
                var dateRange = dayOfMonth <= 16 ? "1 to 16" : "17 to 30";

                var existingRates = await _context.MaterialRates
                    .Where(mr => mr.CustomerId == customerId 
                                && mr.LocationId == locationId 
                                && mr.MaterialType == materialType
                                && mr.Status.ToLower() == "active")
                    .ToListAsync();

                // Filter rates that fall in the same date range
                var ratesInSameRange = existingRates.Where(mr => {
                    var rateDay = mr.EffectiveDate.Day;
                    var rateRange = rateDay <= 16 ? "1 to 16" : "17 to 30";
                    return rateRange == dateRange;
                }).ToList();

                var existingRatesDto = ratesInSameRange.Select(mr => new MaterialRateDto
                {
                    RateId = mr.RateId,
                    CustomerId = mr.CustomerId,
                    LocationId = mr.LocationId,
                    EffectiveDate = mr.EffectiveDate,
                    CompanyRate = mr.CompanyRate,
                    TransporterRate = mr.TransporterRate,
                    Route = mr.Route,
                    MaterialType = mr.MaterialType,
                    Status = mr.Status,
                    CreatedBy = mr.CreatedBy,
                    CreatedOn = mr.CreatedOn,
                    CustomerName = "Customer", // Default value
                    LocationName = "Location", // Default value
                    LocationCode = "LOC" // Default value
                }).ToList();

                response.Result = existingRatesDto;
                response.Success = true;
                response.Message = existingRatesDto.Count > 0 
                    ? $"Found {existingRatesDto.Count} existing active rate(s)" 
                    : "No existing active rates found";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error checking existing rates: {ex.Message}";
            }

            return response;
        }

        private async Task DeactivateExistingRatesAsync(int customerId, int locationId, string materialType, DateTime effectiveDate)
        {
            // Convert the input date to a range for comparison
            var dayOfMonth = effectiveDate.Day;
            var dateRange = dayOfMonth <= 16 ? "1 to 16" : "17 to 30";

            var existingRates = await _context.MaterialRates
                .Where(mr => mr.CustomerId == customerId 
                            && mr.LocationId == locationId 
                            && mr.MaterialType == materialType
                            && mr.Status.ToLower() == "active")
                .ToListAsync();

            // Filter rates that fall in the same date range
            var ratesInSameRange = existingRates.Where(mr => {
                var rateDay = mr.EffectiveDate.Day;
                var rateRange = rateDay <= 16 ? "1 to 16" : "17 to 30";
                return rateRange == dateRange;
            }).ToList();

            foreach (var rate in ratesInSameRange)
            {
                rate.Status = "Inactive";
            }

            await _context.SaveChangesAsync();
        }
    }
}