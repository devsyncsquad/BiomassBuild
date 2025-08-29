using Biomass.Server.Models.Vendor;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Biomass.Server.Interfaces
{
    public interface IVendorService
    {
        Task<List<VendorDto>> GetAllVendorsAsync();
        Task<VendorDto> GetVendorByIdAsync(int id);
        Task<VendorDto> CreateVendorAsync(CreateVendorRequest request, int userId);
        Task<VendorDto> UpdateVendorAsync(int id, UpdateVendorRequest request, int userId);
    }
}