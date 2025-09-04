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
        private readonly IFileService _fileService;

        public VendorService(ApplicationDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
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
                // Handle file uploads
                string? frontPicPath = null;
                string? backPicPath = null;

                if (request.VendorCnicFrontPic != null)
                {
                    frontPicPath = await _fileService.SaveFileAsync(request.VendorCnicFrontPic, "uploads/vendors/cnic");
                }

                if (request.VendorCnicBackPic != null)
                {
                    backPicPath = await _fileService.SaveFileAsync(request.VendorCnicBackPic, "uploads/vendors/cnic");
                }

                var vendor = new Vendor
                {
                    VendorName = request.VendorName,
                    Address = request.Address,
                    Phone1 = request.Phone1,
                    Phone2 = request.Phone2,
                    Phone3 = request.Phone3,
                    Cnic = request.Cnic,
                    Status = request.Status ?? "Active",
                    IsVehicleLoader = request.IsVehicleLoader,
                    IsLabour = request.IsLabour,
                    VendorCnicFrontPic = frontPicPath,
                    VendorCnicBackPic = backPicPath
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

                // Handle file uploads
                if (request.VendorCnicFrontPic != null)
                {
                    // Delete old file if exists
                    if (!string.IsNullOrEmpty(vendor.VendorCnicFrontPic))
                    {
                        await _fileService.DeleteFileAsync(vendor.VendorCnicFrontPic);
                    }
                    vendor.VendorCnicFrontPic = await _fileService.SaveFileAsync(request.VendorCnicFrontPic, "uploads/vendors/cnic");
                }

                if (request.VendorCnicBackPic != null)
                {
                    // Delete old file if exists
                    if (!string.IsNullOrEmpty(vendor.VendorCnicBackPic))
                    {
                        await _fileService.DeleteFileAsync(vendor.VendorCnicBackPic);
                    }
                    vendor.VendorCnicBackPic = await _fileService.SaveFileAsync(request.VendorCnicBackPic, "uploads/vendors/cnic");
                }

                // Update other fields
                if (!string.IsNullOrEmpty(request.VendorName))
                    vendor.VendorName = request.VendorName;
                if (!string.IsNullOrEmpty(request.Address))
                    vendor.Address = request.Address;
                if (!string.IsNullOrEmpty(request.Phone1))
                    vendor.Phone1 = request.Phone1;
                if (!string.IsNullOrEmpty(request.Phone2))
                    vendor.Phone2 = request.Phone2;
                if (!string.IsNullOrEmpty(request.Phone3))
                    vendor.Phone3 = request.Phone3;
                if (!string.IsNullOrEmpty(request.Cnic))
                    vendor.Cnic = request.Cnic;
                if (!string.IsNullOrEmpty(request.Status))
                    vendor.Status = request.Status;
                
                vendor.IsVehicleLoader = request.IsVehicleLoader;
                vendor.IsLabour = request.IsLabour;

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
                VendorCnicFrontPic = !string.IsNullOrEmpty(vendor.VendorCnicFrontPic) 
                    ? $"/api/vendors/images/{vendor.VendorCnicFrontPic}" 
                    : null,
                VendorCnicBackPic = !string.IsNullOrEmpty(vendor.VendorCnicBackPic) 
                    ? $"/api/vendors/images/{vendor.VendorCnicBackPic}" 
                    : null,
                Cnic = vendor.Cnic,
                Status = vendor.Status,
                IsVehicleLoader = vendor.IsVehicleLoader,
                IsLabour = vendor.IsLabour
            };
        }
    }
}