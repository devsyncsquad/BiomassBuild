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
                    .Join(_context.Customers, mr => mr.CustomerId, c => c.CustomerId, (mr, c) => new { mr, c })
                    .Join(_context.CustomerLocations, mr => mr.mr.LocationId, cl => cl.LocationId, (mr, cl) => new { mr.mr, mr.c, cl })
                    .Select(x => new MaterialRateDto
                    {
                        RateId = x.mr.RateId,
                        CustomerId = x.mr.CustomerId,
                        LocationId = x.mr.LocationId,
                        EffectiveDate = x.mr.EffectiveDate,
                        CompanyRate = x.mr.CompanyRate,
                        TransporterRate = x.mr.TransporterRate,
                        DieselRate = x.mr.DieselRate,
                        Route = x.mr.Route,
                        MaterialType = x.mr.MaterialType,
                        Status = x.mr.Status,
                        CreatedBy = x.mr.CreatedBy,
                        CreatedOn = x.mr.CreatedOn,
                        CustomerName = x.c.CompanyName ?? $"{x.c.FirstName} {x.c.LastName}",
                        LocationName = x.cl.LocationName,
                        LocationCode = x.cl.LocationCode
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
                    .Join(_context.Customers, mr => mr.CustomerId, c => c.CustomerId, (mr, c) => new { mr, c })
                    .Join(_context.CustomerLocations, mr => mr.mr.LocationId, cl => cl.LocationId, (mr, cl) => new { mr.mr, mr.c, cl })
                    .OrderByDescending(x => x.mr.EffectiveDate)
                    .Select(x => new MaterialRateDto
                    {
                        RateId = x.mr.RateId,
                        CustomerId = x.mr.CustomerId,
                        LocationId = x.mr.LocationId,
                        EffectiveDate = x.mr.EffectiveDate,
                        CompanyRate = x.mr.CompanyRate,
                        TransporterRate = x.mr.TransporterRate,
                        DieselRate = x.mr.DieselRate,
                        Route = x.mr.Route,
                        MaterialType = x.mr.MaterialType,
                        Status = x.mr.Status,
                        CreatedBy = x.mr.CreatedBy,
                        CreatedOn = x.mr.CreatedOn,
                        CustomerName = x.c.CompanyName ?? $"{x.c.FirstName} {x.c.LastName}",
                        LocationName = x.cl.LocationName,
                        LocationCode = x.cl.LocationCode
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
                    .Join(_context.Customers, mr => mr.CustomerId, c => c.CustomerId, (mr, c) => new { mr, c })
                    .Join(_context.CustomerLocations, mr => mr.mr.LocationId, cl => cl.LocationId, (mr, cl) => new { mr.mr, mr.c, cl })
                    .Select(x => new MaterialRateDto
                    {
                        RateId = x.mr.RateId,
                        CustomerId = x.mr.CustomerId,
                        LocationId = x.mr.LocationId,
                        EffectiveDate = x.mr.EffectiveDate,
                        CompanyRate = x.mr.CompanyRate,
                        TransporterRate = x.mr.TransporterRate,
                        DieselRate = x.mr.DieselRate,
                        Route = x.mr.Route,
                        MaterialType = x.mr.MaterialType,
                        Status = x.mr.Status,
                        CreatedBy = x.mr.CreatedBy,
                        CreatedOn = x.mr.CreatedOn,
                        CustomerName = x.c.CompanyName ?? $"{x.c.FirstName} {x.c.LastName}",
                        LocationName = x.cl.LocationName,
                        LocationCode = x.cl.LocationCode
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
                    DieselRate = request.DieselRate,
                    Route = request.Route ?? "", // Handle null route
                    MaterialType = request.MaterialType,
                    Status = "Active",
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
                materialRate.DieselRate = request.DieselRate;
                materialRate.Route = request.Route ?? ""; // Handle null route
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

        // Commented out - method not compatible with string EffectiveDate
        public async Task<ServiceResponse<List<MaterialRateDto>>> GetMaterialRatesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var response = new ServiceResponse<List<MaterialRateDto>>();

            try
            {
                var materialRates = await _context.MaterialRates
                    .Where(mr => mr.EffectiveDate == "1-15" || mr.EffectiveDate == "16-31") // Simplified for string comparison
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
                    .Join(_context.Customers, mr => mr.CustomerId, c => c.CustomerId, (mr, c) => new { mr, c })
                    .Join(_context.CustomerLocations, mr => mr.mr.LocationId, cl => cl.LocationId, (mr, cl) => new { mr.mr, mr.c, cl })
                    .OrderByDescending(x => x.mr.EffectiveDate)
                    .Select(x => new MaterialRateDto
                    {
                        RateId = x.mr.RateId,
                        CustomerId = x.mr.CustomerId,
                        LocationId = x.mr.LocationId,
                        EffectiveDate = x.mr.EffectiveDate,
                        CompanyRate = x.mr.CompanyRate,
                        TransporterRate = x.mr.TransporterRate,
                        DieselRate = x.mr.DieselRate,
                        Route = x.mr.Route,
                        MaterialType = x.mr.MaterialType,
                        Status = x.mr.Status,
                        CreatedBy = x.mr.CreatedBy,
                        CreatedOn = x.mr.CreatedOn,
                        CustomerName = x.c.CompanyName ?? $"{x.c.FirstName} {x.c.LastName}",
                        LocationName = x.cl.LocationName,
                        LocationCode = x.cl.LocationCode
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

        public async Task<ServiceResponse<List<MaterialRateDto>>> CheckExistingActiveRatesAsync(int customerId, int locationId, string materialType, string effectiveDate)
        {
            var response = new ServiceResponse<List<MaterialRateDto>>();

            try
            {
                // Use string comparison for effective date
                var existingRates = await _context.MaterialRates
                    .Where(mr => mr.CustomerId == customerId 
                                && mr.LocationId == locationId 
                                && mr.MaterialType == materialType
                                && mr.EffectiveDate == effectiveDate
                                && mr.Status.ToLower() == "active")
                    .Join(_context.Customers, mr => mr.CustomerId, c => c.CustomerId, (mr, c) => new { mr, c })
                    .Join(_context.CustomerLocations, mr => mr.mr.LocationId, cl => cl.LocationId, (mr, cl) => new { mr.mr, mr.c, cl })
                    .Select(x => new MaterialRateDto
                    {
                        RateId = x.mr.RateId,
                        CustomerId = x.mr.CustomerId,
                        LocationId = x.mr.LocationId,
                        EffectiveDate = x.mr.EffectiveDate,
                        CompanyRate = x.mr.CompanyRate,
                        TransporterRate = x.mr.TransporterRate,
                        DieselRate = x.mr.DieselRate,
                        Route = x.mr.Route,
                        MaterialType = x.mr.MaterialType,
                        Status = x.mr.Status,
                        CreatedBy = x.mr.CreatedBy,
                        CreatedOn = x.mr.CreatedOn,
                        CustomerName = x.c.CompanyName ?? $"{x.c.FirstName} {x.c.LastName}",
                        LocationName = x.cl.LocationName,
                        LocationCode = x.cl.LocationCode
                    })
                    .ToListAsync();

                response.Result = existingRates;
                response.Success = true;
                response.Message = existingRates.Count > 0 
                    ? $"Found {existingRates.Count} existing active rate(s)" 
                    : "No existing active rates found";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error checking existing rates: {ex.Message}";
            }

            return response;
        }

        private async Task DeactivateExistingRatesAsync(int customerId, int locationId, string materialType, string effectiveDate)
        {
            var existingRates = await _context.MaterialRates
                .Where(mr => mr.CustomerId == customerId 
                            && mr.LocationId == locationId 
                            && mr.MaterialType == materialType
                            && mr.EffectiveDate == effectiveDate
                            && mr.Status.ToLower() == "active")
                .ToListAsync();

            foreach (var rate in existingRates)
            {
                rate.Status = "Inactive";
            }

            await _context.SaveChangesAsync();
        }
    }
}