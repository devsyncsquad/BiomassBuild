using Microsoft.EntityFrameworkCore;
using Biomass.Server.Data;
using Biomass.Server.Models.Customer;
using Biomass.Server.Models;
using Biomass.Api.Model;

using Biomass.Server.Interfaces;

namespace Biomass.Server.Services
{
    public class CustomerLocationService : ICustomerLocationService
    {
        private readonly ApplicationDbContext _context;

        public CustomerLocationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<List<CustomerLocationDto>>> GetAllLocationsAsync()
        {
            var response = new ServiceResponse<List<CustomerLocationDto>>();

            try
            {
                var locations = await _context.CustomerLocations
                    .Include(l => l.Customer)
                    .Select(l => new CustomerLocationDto
                    {
                        LocationId = l.LocationId,
                        CustomerId = l.CustomerId,
                        LocationName = l.LocationName,
                        LocationCode = l.LocationCode,
                        Address = l.Address,
                        Latitude = l.Latitude,
                        Longitude = l.Longitude,
                        CenterDispatchWeightLimit = l.CenterDispatchWeightLimit,
                        AdvancePercentageAllowed = l.AdvancePercentageAllowed,
                        ToleranceLimitPercentage = l.ToleranceLimitPercentage,
                        ToleranceLimitKg = l.ToleranceLimitKg,
                        MaterialPenaltyRatePerKg = l.MaterialPenaltyRatePerKg,
                        DispatchLoadingChargesEnabled = l.DispatchLoadingChargesEnabled,
                        DispatchChargeType = l.DispatchChargeType,
                        FixedLoaderCost = l.FixedLoaderCost,
                        VariableChargeType = l.VariableChargeType,
                        VariableChargeAmount = l.VariableChargeAmount,
                        LaborChargesEnabled = l.LaborChargesEnabled,
                        LaborChargeType = l.LaborChargeType,
                        LaborChargesCost = l.LaborChargesCost,
                        ReceivingUnloadingCostEnabled = l.ReceivingUnloadingCostEnabled,
                        ReceivingChargeType = l.ReceivingChargeType,
                        FixedUnloadingCost = l.FixedUnloadingCost,
                        ReceivingVariableChargeType = l.ReceivingVariableChargeType,
                        ReceivingVariableChargeAmount = l.ReceivingVariableChargeAmount,
                        Status = l.Status,
                        CreatedOn = l.CreatedOn,
                        LastUpdatedOn = l.LastUpdatedOn,
                        CustomerName = $"{l.Customer.FirstName} {l.Customer.LastName}"
                    })
                    .ToListAsync();

                response.Result = locations;
                response.Success = true;
                response.Message = "Locations retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving locations: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<List<CustomerLocationDto>>> GetLocationsByCustomerIdAsync(int customerId)
        {
            var response = new ServiceResponse<List<CustomerLocationDto>>();

            try
            {
                var locations = await _context.CustomerLocations
                    .Include(l => l.Customer)
                    .Where(l => l.CustomerId == customerId)
                    .Select(l => new CustomerLocationDto
                    {
                        LocationId = l.LocationId,
                        CustomerId = l.CustomerId,
                        LocationName = l.LocationName,
                        LocationCode = l.LocationCode,
                        Address = l.Address,
                        Latitude = l.Latitude,
                        Longitude = l.Longitude,
                        CenterDispatchWeightLimit = l.CenterDispatchWeightLimit,
                        AdvancePercentageAllowed = l.AdvancePercentageAllowed,
                        ToleranceLimitPercentage = l.ToleranceLimitPercentage,
                        ToleranceLimitKg = l.ToleranceLimitKg,
                        MaterialPenaltyRatePerKg = l.MaterialPenaltyRatePerKg,
                        DispatchLoadingChargesEnabled = l.DispatchLoadingChargesEnabled,
                        DispatchChargeType = l.DispatchChargeType,
                        FixedLoaderCost = l.FixedLoaderCost,
                        VariableChargeType = l.VariableChargeType,
                        VariableChargeAmount = l.VariableChargeAmount,
                        LaborChargesEnabled = l.LaborChargesEnabled,
                        LaborChargeType = l.LaborChargeType,
                        LaborChargesCost = l.LaborChargesCost,
                        ReceivingUnloadingCostEnabled = l.ReceivingUnloadingCostEnabled,
                        ReceivingChargeType = l.ReceivingChargeType,
                        FixedUnloadingCost = l.FixedUnloadingCost,
                        ReceivingVariableChargeType = l.ReceivingVariableChargeType,
                        ReceivingVariableChargeAmount = l.ReceivingVariableChargeAmount,
                        Status = l.Status,
                        CreatedOn = l.CreatedOn,
                        LastUpdatedOn = l.LastUpdatedOn,
                        CustomerName = $"{l.Customer.FirstName} {l.Customer.LastName}"
                    })
                    .ToListAsync();

                response.Result = locations;
                response.Success = true;
                response.Message = "Locations retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving locations: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<CustomerLocationDto>> GetLocationByIdAsync(int locationId)
        {
            var response = new ServiceResponse<CustomerLocationDto>();

            try
            {
                var location = await _context.CustomerLocations
                    .Include(l => l.Customer)
                    .Where(l => l.LocationId == locationId)
                    .Select(l => new CustomerLocationDto
                    {
                        LocationId = l.LocationId,
                        CustomerId = l.CustomerId,
                        LocationName = l.LocationName,
                        LocationCode = l.LocationCode,
                        Address = l.Address,
                        Latitude = l.Latitude,
                        Longitude = l.Longitude,
                        CenterDispatchWeightLimit = l.CenterDispatchWeightLimit,
                        AdvancePercentageAllowed = l.AdvancePercentageAllowed,
                        ToleranceLimitPercentage = l.ToleranceLimitPercentage,
                        ToleranceLimitKg = l.ToleranceLimitKg,
                        MaterialPenaltyRatePerKg = l.MaterialPenaltyRatePerKg,
                        DispatchLoadingChargesEnabled = l.DispatchLoadingChargesEnabled,
                        DispatchChargeType = l.DispatchChargeType,
                        FixedLoaderCost = l.FixedLoaderCost,
                        VariableChargeType = l.VariableChargeType,
                        VariableChargeAmount = l.VariableChargeAmount,
                        LaborChargesEnabled = l.LaborChargesEnabled,
                        LaborChargeType = l.LaborChargeType,
                        LaborChargesCost = l.LaborChargesCost,
                        ReceivingUnloadingCostEnabled = l.ReceivingUnloadingCostEnabled,
                        ReceivingChargeType = l.ReceivingChargeType,
                        FixedUnloadingCost = l.FixedUnloadingCost,
                        ReceivingVariableChargeType = l.ReceivingVariableChargeType,
                        ReceivingVariableChargeAmount = l.ReceivingVariableChargeAmount,
                        Status = l.Status,
                        CreatedOn = l.CreatedOn,
                        LastUpdatedOn = l.LastUpdatedOn,
                        CustomerName = $"{l.Customer.FirstName} {l.Customer.LastName}"
                    })
                    .FirstOrDefaultAsync();

                if (location == null)
                {
                    response.Success = false;
                    response.Message = "Location not found";
                    return response;
                }

                response.Result = location;
                response.Success = true;
                response.Message = "Location retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving location: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<CustomerLocationDto>> CreateLocationAsync(CreateCustomerLocationRequest request)
        {
            var response = new ServiceResponse<CustomerLocationDto>();

            try
            {
                // Check if customer exists
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId);

                if (customer == null)
                {
                    response.Success = false;
                    response.Message = "Customer not found";
                    return response;
                }

                // Check if location code already exists for this customer
                var existingLocation = await _context.CustomerLocations
                    .FirstOrDefaultAsync(l => l.CustomerId == request.CustomerId && l.LocationCode == request.LocationCode);

                if (existingLocation != null)
                {
                    response.Success = false;
                    response.Message = "Location with this code already exists for this customer";
                    return response;
                }

                var location = new CustomerLocation
                {
                    CustomerId = request.CustomerId,
                    LocationName = request.LocationName,
                    LocationCode = request.LocationCode,
                    Address = request.Address,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude,
                    CenterDispatchWeightLimit = request.CenterDispatchWeightLimit,
                    AdvancePercentageAllowed = request.AdvancePercentageAllowed,
                    ToleranceLimitPercentage = request.ToleranceLimitPercentage,
                    ToleranceLimitKg = request.ToleranceLimitKg,
                    MaterialPenaltyRatePerKg = request.MaterialPenaltyRatePerKg,
                    DispatchLoadingChargesEnabled = request.DispatchLoadingChargesEnabled,
                    DispatchChargeType = request.DispatchChargeType,
                    FixedLoaderCost = request.FixedLoaderCost,
                    VariableChargeType = request.VariableChargeType,
                    VariableChargeAmount = request.VariableChargeAmount,
                    LaborChargesEnabled = request.LaborChargesEnabled,
                    LaborChargeType = request.LaborChargeType,
                    LaborChargesCost = request.LaborChargesCost,
                    ReceivingUnloadingCostEnabled = request.ReceivingUnloadingCostEnabled,
                    ReceivingChargeType = request.ReceivingChargeType,
                    FixedUnloadingCost = request.FixedUnloadingCost,
                    ReceivingVariableChargeType = request.ReceivingVariableChargeType,
                    ReceivingVariableChargeAmount = request.ReceivingVariableChargeAmount,
                    Status = "active",
                    CreatedBy = 1, // TODO: Get from current user context
                    CreatedOn = DateTime.UtcNow
                };

                _context.CustomerLocations.Add(location);
                await _context.SaveChangesAsync();

                var locationDto = new CustomerLocationDto
                {
                    LocationId = location.LocationId,
                    CustomerId = location.CustomerId,
                    LocationName = location.LocationName,
                    LocationCode = location.LocationCode,
                    Address = location.Address,
                    Latitude = location.Latitude,
                    Longitude = location.Longitude,
                    CenterDispatchWeightLimit = location.CenterDispatchWeightLimit,
                    AdvancePercentageAllowed = location.AdvancePercentageAllowed,
                    ToleranceLimitPercentage = location.ToleranceLimitPercentage,
                    ToleranceLimitKg = location.ToleranceLimitKg,
                    MaterialPenaltyRatePerKg = location.MaterialPenaltyRatePerKg,
                    DispatchLoadingChargesEnabled = location.DispatchLoadingChargesEnabled,
                    DispatchChargeType = location.DispatchChargeType,
                    FixedLoaderCost = location.FixedLoaderCost,
                    VariableChargeType = location.VariableChargeType,
                    VariableChargeAmount = location.VariableChargeAmount,
                    LaborChargesEnabled = location.LaborChargesEnabled,
                    LaborChargeType = location.LaborChargeType,
                    LaborChargesCost = location.LaborChargesCost,
                    ReceivingUnloadingCostEnabled = location.ReceivingUnloadingCostEnabled,
                    ReceivingChargeType = location.ReceivingChargeType,
                    FixedUnloadingCost = location.FixedUnloadingCost,
                    ReceivingVariableChargeType = location.ReceivingVariableChargeType,
                    ReceivingVariableChargeAmount = location.ReceivingVariableChargeAmount,
                    Status = location.Status,
                    CreatedOn = location.CreatedOn,
                    CustomerName = $"{customer.FirstName} {customer.LastName}"
                };

                response.Result = locationDto;
                response.Success = true;
                response.Message = "Location created successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error creating location: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<CustomerLocationDto>> UpdateLocationAsync(int locationId, UpdateCustomerLocationRequest request)
        {
            var response = new ServiceResponse<CustomerLocationDto>();

            try
            {
                var location = await _context.CustomerLocations
                    .Include(l => l.Customer)
                    .FirstOrDefaultAsync(l => l.LocationId == locationId);

                if (location == null)
                {
                    response.Success = false;
                    response.Message = "Location not found";
                    return response;
                }

                // Check if location code already exists for another location of the same customer
                var existingLocation = await _context.CustomerLocations
                    .FirstOrDefaultAsync(l => l.CustomerId == location.CustomerId && 
                                            l.LocationCode == request.LocationCode && 
                                            l.LocationId != locationId);

                if (existingLocation != null)
                {
                    response.Success = false;
                    response.Message = "Location with this code already exists for this customer";
                    return response;
                }

                location.LocationName = request.LocationName;
                location.LocationCode = request.LocationCode;
                location.Address = request.Address;
                location.Latitude = request.Latitude;
                location.Longitude = request.Longitude;
                location.CenterDispatchWeightLimit = request.CenterDispatchWeightLimit;
                location.AdvancePercentageAllowed = request.AdvancePercentageAllowed;
                location.ToleranceLimitPercentage = request.ToleranceLimitPercentage;
                location.ToleranceLimitKg = request.ToleranceLimitKg;
                location.MaterialPenaltyRatePerKg = request.MaterialPenaltyRatePerKg;
                location.DispatchLoadingChargesEnabled = request.DispatchLoadingChargesEnabled;
                location.DispatchChargeType = request.DispatchChargeType;
                location.FixedLoaderCost = request.FixedLoaderCost;
                location.VariableChargeType = request.VariableChargeType;
                location.VariableChargeAmount = request.VariableChargeAmount;
                location.LaborChargesEnabled = request.LaborChargesEnabled;
                location.LaborChargeType = request.LaborChargeType;
                location.LaborChargesCost = request.LaborChargesCost;
                location.ReceivingUnloadingCostEnabled = request.ReceivingUnloadingCostEnabled;
                location.ReceivingChargeType = request.ReceivingChargeType;
                location.FixedUnloadingCost = request.FixedUnloadingCost;
                location.ReceivingVariableChargeType = request.ReceivingVariableChargeType;
                location.ReceivingVariableChargeAmount = request.ReceivingVariableChargeAmount;
                location.Status = request.Status;
                location.LastUpdatedOn = DateTime.UtcNow;
                location.LastUpdatedBy = 1; // TODO: Get from current user context

                await _context.SaveChangesAsync();

                var locationDto = new CustomerLocationDto
                {
                    LocationId = location.LocationId,
                    CustomerId = location.CustomerId,
                    LocationName = location.LocationName,
                    LocationCode = location.LocationCode,
                    Address = location.Address,
                    Latitude = location.Latitude,
                    Longitude = location.Longitude,
                    CenterDispatchWeightLimit = location.CenterDispatchWeightLimit,
                    AdvancePercentageAllowed = location.AdvancePercentageAllowed,
                    ToleranceLimitPercentage = location.ToleranceLimitPercentage,
                    ToleranceLimitKg = location.ToleranceLimitKg,
                    MaterialPenaltyRatePerKg = location.MaterialPenaltyRatePerKg,
                    DispatchLoadingChargesEnabled = location.DispatchLoadingChargesEnabled,
                    DispatchChargeType = location.DispatchChargeType,
                    FixedLoaderCost = location.FixedLoaderCost,
                    VariableChargeType = location.VariableChargeType,
                    VariableChargeAmount = location.VariableChargeAmount,
                    LaborChargesEnabled = location.LaborChargesEnabled,
                    LaborChargeType = location.LaborChargeType,
                    LaborChargesCost = location.LaborChargesCost,
                    ReceivingUnloadingCostEnabled = location.ReceivingUnloadingCostEnabled,
                    ReceivingChargeType = location.ReceivingChargeType,
                    FixedUnloadingCost = location.FixedUnloadingCost,
                    ReceivingVariableChargeType = location.ReceivingVariableChargeType,
                    ReceivingVariableChargeAmount = location.ReceivingVariableChargeAmount,
                    Status = location.Status,
                    CreatedOn = location.CreatedOn,
                    LastUpdatedOn = location.LastUpdatedOn,
                    CustomerName = $"{location.Customer.FirstName} {location.Customer.LastName}"
                };

                response.Result = locationDto;
                response.Success = true;
                response.Message = "Location updated successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error updating location: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteLocationAsync(int locationId)
        {
            var response = new ServiceResponse<bool>();

            try
            {
                var location = await _context.CustomerLocations
                    .FirstOrDefaultAsync(l => l.LocationId == locationId);

                if (location == null)
                {
                    response.Success = false;
                    response.Message = "Location not found";
                    return response;
                }

                _context.CustomerLocations.Remove(location);
                await _context.SaveChangesAsync();

                response.Result = true;
                response.Success = true;
                response.Message = "Location deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error deleting location: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<List<CustomerLocationDto>>> SearchLocationsAsync(string searchTerm, string status = "all")
        {
            var response = new ServiceResponse<List<CustomerLocationDto>>();

            try
            {
                var query = _context.CustomerLocations
                    .Include(l => l.Customer)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    query = query.Where(l =>
                        l.LocationName.Contains(searchTerm) ||
                        l.LocationCode.Contains(searchTerm) ||
                        l.Address.Contains(searchTerm) ||
                        l.Customer.FirstName.Contains(searchTerm) ||
                        l.Customer.LastName.Contains(searchTerm));
                }

                if (status != "all")
                {
                    query = query.Where(l => l.Status == status);
                }

                var locations = await query
                    .Select(l => new CustomerLocationDto
                    {
                        LocationId = l.LocationId,
                        CustomerId = l.CustomerId,
                        LocationName = l.LocationName,
                        LocationCode = l.LocationCode,
                        Address = l.Address,
                        Latitude = l.Latitude,
                        Longitude = l.Longitude,
                        CenterDispatchWeightLimit = l.CenterDispatchWeightLimit,
                        AdvancePercentageAllowed = l.AdvancePercentageAllowed,
                        ToleranceLimitPercentage = l.ToleranceLimitPercentage,
                        ToleranceLimitKg = l.ToleranceLimitKg,
                        MaterialPenaltyRatePerKg = l.MaterialPenaltyRatePerKg,
                        DispatchLoadingChargesEnabled = l.DispatchLoadingChargesEnabled,
                        DispatchChargeType = l.DispatchChargeType,
                        FixedLoaderCost = l.FixedLoaderCost,
                        VariableChargeType = l.VariableChargeType,
                        VariableChargeAmount = l.VariableChargeAmount,
                        LaborChargesEnabled = l.LaborChargesEnabled,
                        LaborChargeType = l.LaborChargeType,
                        LaborChargesCost = l.LaborChargesCost,
                        ReceivingUnloadingCostEnabled = l.ReceivingUnloadingCostEnabled,
                        ReceivingChargeType = l.ReceivingChargeType,
                        FixedUnloadingCost = l.FixedUnloadingCost,
                        ReceivingVariableChargeType = l.ReceivingVariableChargeType,
                        ReceivingVariableChargeAmount = l.ReceivingVariableChargeAmount,
                        Status = l.Status,
                        CreatedOn = l.CreatedOn,
                        LastUpdatedOn = l.LastUpdatedOn,
                        CustomerName = $"{l.Customer.FirstName} {l.Customer.LastName}"
                    })
                    .ToListAsync();

                response.Result = locations;
                response.Success = true;
                response.Message = "Locations searched successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error searching locations: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<int>> GetLocationCountAsync(int customerId)
        {
            var response = new ServiceResponse<int>();

            try
            {
                var count = await _context.CustomerLocations
                    .Where(l => l.CustomerId == customerId)
                    .CountAsync();
                
                response.Result = count;
                response.Success = true;
                response.Message = "Location count retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error getting location count: {ex.Message}";
            }

            return response;
        }
        
        public async Task<ServiceResponse<LocationCostsDto>> GetLocationCostsForDispatchAsync(int locationId)
        {
            var response = new ServiceResponse<LocationCostsDto>();

            try
            {
                var location = await _context.CustomerLocations
                    .Include(l => l.Customer)
                    .Where(l => l.LocationId == locationId && l.Status.ToLower() == "active")
                    .Select(l => new LocationCostsDto
                    {
                        LocationId = l.LocationId,
                        LocationName = l.LocationName,
                        LocationCode = l.LocationCode,
                        CustomerId = l.CustomerId,
                        CustomerName = l.Customer.FirstName + " " + l.Customer.LastName,
                        
                        // Dispatch Loading Charges
                        DispatchLoadingChargesEnabled = l.DispatchLoadingChargesEnabled,
                        DispatchChargeType = l.DispatchChargeType,
                        FixedLoaderCost = l.FixedLoaderCost,
                        VariableChargeType = l.VariableChargeType,
                        VariableChargeAmount = l.VariableChargeAmount,
                        
                        // Labour Charges
                        LaborChargesEnabled = l.LaborChargesEnabled,
                        LaborChargeType = l.LaborChargeType,
                        LaborChargesCost = l.LaborChargesCost,
                        
                        // Receiving Unloading Cost
                        ReceivingUnloadingCostEnabled = l.ReceivingUnloadingCostEnabled,
                        ReceivingChargeType = l.ReceivingChargeType,
                        FixedUnloadingCost = l.FixedUnloadingCost,
                        ReceivingVariableChargeType = l.ReceivingVariableChargeType,
                        ReceivingVariableChargeAmount = l.ReceivingVariableChargeAmount,
                        
                        // Tolerance and Limits
                        ToleranceLimitPercentage = l.ToleranceLimitPercentage,
                        ToleranceLimitKg = l.ToleranceLimitKg,
                        CenterDispatchWeightLimit = l.CenterDispatchWeightLimit,
                        MaterialPenaltyRatePerKg = l.MaterialPenaltyRatePerKg
                    })
                    .FirstOrDefaultAsync();

                if (location == null)
                {
                    response.Success = false;
                    response.Message = "Location not found or inactive";
                    return response;
                }

                response.Result = location;
                response.Success = true;
                response.Message = "Location costs retrieved successfully for dispatch";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving location costs: {ex.Message}";
            }

            return response;
        }
    }
} 