using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Biomass.Server.Data;
using Biomass.Server.Models.Vendor;
using Biomass.Server.Interfaces;

namespace Biomass.Server.Services
{
    public class VendorService : IVendorService
    {
        private readonly ApplicationDbContext _context;

        public VendorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<VendorDto>> GetAllVendorsAsync()
        {
            try
            {
                var vendors = await _context.Vendors.ToListAsync();

                return vendors.Select(MapToVendorDto).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendors: {ex.Message}");
            }
        }

        public async Task<VendorDto> GetVendorByIdAsync(int id)
        {
            try
            {
                var vendor = await _context.Vendors
                    .FirstOrDefaultAsync(v => v.VendorId == id);

                return vendor == null ? null : MapToVendorDto(vendor);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendor: {ex.Message}");
            }
        }

        public async Task<VendorDto> CreateVendorAsync(CreateVendorRequest request, int userId)
        {
            try
            {
                var vendor = new Vendor
                {
                    VendorName = request.VendorName,
                    Address = request.Address,
                    Phone1 = request.Phone1,
                    Phone2 = request.Phone2,
                    Phone3 = request.Phone3,
                    Cnic = request.Cnic,
                    Status = "Active"
                };

                _context.Vendors.Add(vendor);
                await _context.SaveChangesAsync();

                return await GetVendorByIdAsync(vendor.VendorId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating vendor: {ex.Message}");
            }
        }

        public async Task<VendorDto> UpdateVendorAsync(int id, UpdateVendorRequest request, int userId)
        {
            try
            {
                var vendor = await _context.Vendors.FindAsync(id);
                if (vendor == null)
                    return null;

                vendor.VendorName = request.VendorName;
                vendor.Address = request.Address;
                vendor.Phone1 = request.Phone1;
                vendor.Phone2 = request.Phone2;
                vendor.Phone3 = request.Phone3;
                vendor.Cnic = request.Cnic;
                vendor.Status = request.Status;

                await _context.SaveChangesAsync();

                return await GetVendorByIdAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating vendor: {ex.Message}");
            }
        }

        private VendorDto MapToVendorDto(Vendor vendor)
        {
            return new VendorDto
            {
                VendorId = vendor.VendorId,
                VendorName = vendor.VendorName,
                Address = vendor.Address,
                Phone1 = vendor.Phone1,
                Phone2 = vendor.Phone2,
                Phone3 = vendor.Phone3,
                VendorCnicFrontPic = vendor.VendorCnicFrontPic,
                VendorCnicBackPic = vendor.VendorCnicBackPic,
                Cnic = vendor.Cnic,
                Status = vendor.Status
            };
        }
    }
}