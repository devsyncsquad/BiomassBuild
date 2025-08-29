using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Driver;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
    public class DriverService : IDriverService
    {
        private readonly ApplicationDbContext _context;

        public DriverService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DriverDto>> GetDriversAsync()
        {
            var drivers = await _context.Drivers.ToListAsync();
            return drivers.Select(MapToDto).ToList();
        }

        public async Task<DriverDto?> GetDriverByIdAsync(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            return driver != null ? MapToDto(driver) : null;
        }

        public async Task<Driver> CreateDriverAsync(CreateDriverRequest request)
        {
            var driver = new Driver
            {
                FullName = request.FullName,
                CNIC = request.CNIC,
                LicenseNumber = request.LicenseNumber,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                Status = request.Status,
                CreatedOn = DateTime.UtcNow
            };

            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();

            return driver;
        }

        public async Task<Driver?> UpdateDriverAsync(int id, UpdateDriverRequest request)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null) return null;

            driver.FullName = request.FullName;
            driver.CNIC = request.CNIC;
            driver.LicenseNumber = request.LicenseNumber;
            driver.PhoneNumber = request.PhoneNumber;
            driver.Address = request.Address;
            driver.Status = request.Status;

            await _context.SaveChangesAsync();
            return driver;
        }

        public async Task<bool> DeleteDriverAsync(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null) return false;

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();
            return true;
        }

        private static DriverDto MapToDto(Driver driver)
        {
            return new DriverDto
            {
                DriverId = driver.DriverId,
                FullName = driver.FullName,
                CNIC = driver.CNIC,
                LicenseNumber = driver.LicenseNumber,
                PhoneNumber = driver.PhoneNumber,
                Address = driver.Address,
                Status = driver.Status,
                CreatedOn = driver.CreatedOn
            };
        }
    }
}