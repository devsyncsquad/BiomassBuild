using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Biomass.Server.Models.Vendor;

namespace Biomass.Server.Interfaces
{
    public interface IVendorRepository
    {
        // Core operations
        Task<Vendor> CreateAsync(Vendor vendor);
        Task<Vendor> UpdateAsync(Vendor vendor);
        Task<bool> DeleteAsync(int id);
        Task<Vendor> GetByIdAsync(int id);
        Task<List<Vendor>> GetAllAsync();

        // Search and filter
        Task<List<Vendor>> GetByStatusAsync(string status);
        Task<List<Vendor>> GetByCategoryAsync(string category);
        Task<List<Vendor>> SearchAsync(string term);

        // Statistics

        // Reference data
        Task<List<string>> GetCategoriesAsync();
    }
} 