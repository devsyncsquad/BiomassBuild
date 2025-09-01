using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Driver;
using Biomass.Server.Models.Vehicle;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly ApplicationDbContext _context;
        private readonly IDriverService _driverService;

        public VehicleService(ApplicationDbContext context, IDriverService driverService)
        {
            _context = context;
            _driverService = driverService;
        }

        public async Task<List<VehicleDto>> GetVehiclesAsync()
        {
            var vehicles = await _context.Vehicles
                .Include(v => v.Driver)
                .ToListAsync();

            return vehicles.Select(MapToDto).ToList();
        }

        public async Task<VehicleDto?> GetVehicleByIdAsync(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Driver)
                .FirstOrDefaultAsync(v => v.VehicleId == id);

            return vehicle != null ? MapToDto(vehicle) : null;
        }

        public async Task<VehicleDto> CreateVehicleWithDriverAsync(CreateVehicleRequest request)
        {
            var vehicle = new Vehicle
            {
                VehicleNumber = request.VehicleNumber,
                VehicleType = request.VehicleType,
                Capacity = request.Capacity,
                FuelType = request.FuelType,
                Status = request.Status,
                VehicleRegNumber = request.VehicleRegNumber,
                VendorId = request.VendorId,
                CostCenterId = request.CostCenterId,
                IsWeightAllocated = request.IsWeightAllocated,
                WeightAllowed = request.WeightAllowed,
                CreatedOn = DateTime.UtcNow
            };

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            // Create driver if provided
            if (request.Driver != null)
            {
                var driver = await _driverService.CreateDriverAsync(request.Driver);
                driver.VehicleId = vehicle.VehicleId;
                await _context.SaveChangesAsync();
                vehicle.Driver = driver;
            }

            return MapToDto(vehicle);
        }

        public async Task<VehicleDto?> UpdateVehicleWithDriverAsync(int id, UpdateVehicleRequest request)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Driver)
                .FirstOrDefaultAsync(v => v.VehicleId == id);

            if (vehicle == null) return null;

            vehicle.VehicleNumber = request.VehicleNumber;
            vehicle.VehicleType = request.VehicleType;
            vehicle.Capacity = request.Capacity;
            vehicle.FuelType = request.FuelType;
            vehicle.Status = request.Status;
            vehicle.VehicleRegNumber = request.VehicleRegNumber;
            vehicle.VendorId = request.VendorId;
            vehicle.CostCenterId = request.CostCenterId;
            vehicle.IsWeightAllocated = request.IsWeightAllocated;
            vehicle.WeightAllowed = request.WeightAllowed;

            // Update driver if provided
            if (request.Driver != null && vehicle.Driver != null)
            {
                var updatedDriver = await _driverService.UpdateDriverAsync(vehicle.Driver.DriverId, request.Driver);
                if (updatedDriver != null)
                {
                    vehicle.Driver = updatedDriver;
                }
            }
            else if (request.Driver != null)
            {
                var newDriver = await _driverService.CreateDriverAsync(request.Driver);
                newDriver.VehicleId = vehicle.VehicleId;
                vehicle.Driver = newDriver;
            }

            await _context.SaveChangesAsync();
            return MapToDto(vehicle);
        }

        public async Task<bool> DeleteVehicleAsync(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Driver)
                .FirstOrDefaultAsync(v => v.VehicleId == id);

            if (vehicle == null) return false;

            if (vehicle.Driver != null)
            {
                vehicle.Driver.VehicleId = null;
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return true;
        }

        private static VehicleDto MapToDto(Vehicle vehicle)
        {
            return new VehicleDto
            {
                VehicleId = vehicle.VehicleId,
                VehicleNumber = vehicle.VehicleNumber,
                VehicleType = vehicle.VehicleType,
                Capacity = vehicle.Capacity,
                FuelType = vehicle.FuelType,
                Status = vehicle.Status,
                CreatedOn = vehicle.CreatedOn,
                VehicleRegNumber = vehicle.VehicleRegNumber,
                VendorId = vehicle.VendorId,
                CostCenterId = vehicle.CostCenterId,
                IsWeightAllocated = vehicle.IsWeightAllocated,
                WeightAllowed = vehicle.WeightAllowed,
                Driver = vehicle.Driver != null ? new DriverDto
                {
                    DriverId = vehicle.Driver.DriverId,
                    FullName = vehicle.Driver.FullName,
                    CNIC = vehicle.Driver.CNIC,
                    LicenseNumber = vehicle.Driver.LicenseNumber,
                    PhoneNumber = vehicle.Driver.PhoneNumber,
                    Address = vehicle.Driver.Address,
                    Status = vehicle.Driver.Status,
                    CreatedOn = vehicle.Driver.CreatedOn
                } : null
            };
        }
    }
}