using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Dispatch;
using Biomass.Server.Models.Vehicle;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
    public class DispatchService : IDispatchService
    {
        private readonly ApplicationDbContext _context;

        public DispatchService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DispatchDto>> GetDispatchesAsync()
        {
            var dispatches = await _context.Dispatches
                .Include(d => d.Vehicle)
                .Include(d => d.Location)
                .OrderByDescending(d => d.CreatedOn)
                .ToListAsync();

            return dispatches.Select(MapToDto).ToList();
        }

        public async Task<DispatchDto?> GetDispatchByIdAsync(int id)
        {
            var dispatch = await _context.Dispatches
                .Include(d => d.Vehicle)
                .Include(d => d.Location)
                .FirstOrDefaultAsync(d => d.DispatchId == id);

            return dispatch != null ? MapToDto(dispatch) : null;
        }

        public async Task<DispatchDto> CreateDispatchAsync(CreateDispatchRequest request)
        {
            var dispatch = new Dispatch
            {
                VehicleId = request.VehicleId,
                LocationId = request.LocationId,
                MaterialType = request.MaterialType,
                MaterialRate = request.MaterialRate,
                SlipNumber = request.SlipNumber,
                SlipPicture = request.SlipPicture,
                FirstWeight = request.FirstWeight,
                SecondWeight = request.SecondWeight,
                NetWeight = request.NetWeight,
                LoaderCharges = request.LoaderCharges,
                LoaderChargesAuto = request.LoaderChargesAuto,
                LoaderChargesType = request.LoaderChargesType,
                LaborCharges = request.LaborCharges,
                LaborChargesAuto = request.LaborChargesAuto,
                LaborChargesType = request.LaborChargesType,
                TransporterRate = request.TransporterRate,
                TransporterRateAuto = request.TransporterRateAuto,
                TransporterChargesType = request.TransporterChargesType,
                Amount = request.Amount,
                TotalDeduction = request.TotalDeduction,
                CreatedBy = request.CreatedBy,
                Status = request.Status,
                PayableWeight = request.PayableWeight,
                CreatedOn = DateTime.UtcNow
            };

            _context.Dispatches.Add(dispatch);
            await _context.SaveChangesAsync();

            // Reload with navigation properties
            await _context.Entry(dispatch)
                .Reference(d => d.Vehicle)
                .LoadAsync();
            await _context.Entry(dispatch)
                .Reference(d => d.Location)
                .LoadAsync();

            return MapToDto(dispatch);
        }

        public async Task<DispatchDto?> UpdateDispatchAsync(int id, UpdateDispatchRequest request)
        {
            var dispatch = await _context.Dispatches
                .Include(d => d.Vehicle)
                .Include(d => d.Location)
                .FirstOrDefaultAsync(d => d.DispatchId == id);

            if (dispatch == null) return null;

            dispatch.VehicleId = request.VehicleId;
            dispatch.LocationId = request.LocationId;
            dispatch.MaterialType = request.MaterialType;
            dispatch.MaterialRate = request.MaterialRate;
            dispatch.SlipNumber = request.SlipNumber;
            dispatch.SlipPicture = request.SlipPicture;
            dispatch.FirstWeight = request.FirstWeight;
            dispatch.SecondWeight = request.SecondWeight;
            dispatch.NetWeight = request.NetWeight;
            dispatch.LoaderCharges = request.LoaderCharges;
            dispatch.LoaderChargesAuto = request.LoaderChargesAuto;
            dispatch.LoaderChargesType = request.LoaderChargesType;
            dispatch.LaborCharges = request.LaborCharges;
            dispatch.LaborChargesAuto = request.LaborChargesAuto;
            dispatch.LaborChargesType = request.LaborChargesType;
            dispatch.TransporterRate = request.TransporterRate;
            dispatch.TransporterRateAuto = request.TransporterRateAuto;
            dispatch.TransporterChargesType = request.TransporterChargesType;
            dispatch.Amount = request.Amount;
            dispatch.TotalDeduction = request.TotalDeduction;
            dispatch.Status = request.Status;
            dispatch.PayableWeight = request.PayableWeight;

            await _context.SaveChangesAsync();
            return MapToDto(dispatch);
        }

        public async Task<bool> DeleteDispatchAsync(int id)
        {
            var dispatch = await _context.Dispatches.FindAsync(id);
            if (dispatch == null) return false;

            _context.Dispatches.Remove(dispatch);
            await _context.SaveChangesAsync();
            return true;
        }

        private static DispatchDto MapToDto(Dispatch dispatch)
        {
            return new DispatchDto
            {
                DispatchId = dispatch.DispatchId,
                VehicleId = dispatch.VehicleId,
                LocationId = dispatch.LocationId,
                MaterialType = dispatch.MaterialType,
                MaterialRate = dispatch.MaterialRate,
                SlipNumber = dispatch.SlipNumber,
                SlipPicture = dispatch.SlipPicture,
                FirstWeight = dispatch.FirstWeight,
                SecondWeight = dispatch.SecondWeight,
                NetWeight = dispatch.NetWeight,
                LoaderCharges = dispatch.LoaderCharges,
                LoaderChargesAuto = dispatch.LoaderChargesAuto,
                LoaderChargesType = dispatch.LoaderChargesType,
                LaborCharges = dispatch.LaborCharges,
                LaborChargesAuto = dispatch.LaborChargesAuto,
                LaborChargesType = dispatch.LaborChargesType,
                TransporterRate = dispatch.TransporterRate,
                TransporterRateAuto = dispatch.TransporterRateAuto,
                TransporterChargesType = dispatch.TransporterChargesType,
                Amount = dispatch.Amount,
                TotalDeduction = dispatch.TotalDeduction,
                CreatedBy = dispatch.CreatedBy,
                CreatedOn = dispatch.CreatedOn,
                Status = dispatch.Status,
                PayableWeight = dispatch.PayableWeight,
                Vehicle = dispatch.Vehicle != null ? new VehicleDto
                {
                    VehicleId = dispatch.Vehicle.VehicleId,
                    VehicleNumber = dispatch.Vehicle.VehicleNumber,
                    VehicleType = dispatch.Vehicle.VehicleType,
                    Capacity = dispatch.Vehicle.Capacity,
                    FuelType = dispatch.Vehicle.FuelType,
                    Status = dispatch.Vehicle.Status,
                    CreatedOn = dispatch.Vehicle.CreatedOn,
                    VehicleRegNumber = dispatch.Vehicle.VehicleRegNumber,
                    VendorId = dispatch.Vehicle.VendorId
                } : null,
                Location = dispatch.Location
            };
        }
    }
}
