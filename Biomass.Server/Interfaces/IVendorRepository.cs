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
        Task<VendorStatisticsDto> GetStatisticsAsync();

        // Documents
        Task<VendorDocument> AddDocumentAsync(VendorDocument document);
        Task<bool> UpdateDocumentAsync(VendorDocument document);
        Task<List<VendorDocument>> GetDocumentsByVendorIdAsync(int vendorId);

        // Contacts
        Task<VendorContact> AddContactAsync(VendorContact contact);
        Task<bool> UpdateContactAsync(VendorContact contact);
        Task<List<VendorContact>> GetContactsByVendorIdAsync(int vendorId);

        // Services
        Task<VendorService> AddServiceAsync(VendorService service);
        Task<bool> UpdateServiceAsync(VendorService service);
        Task<List<VendorService>> GetServicesByVendorIdAsync(int vendorId);

        // Reviews
        Task<VendorReview> AddReviewAsync(VendorReview review);
        Task<bool> UpdateReviewAsync(VendorReview review);
        Task<List<VendorReview>> GetReviewsByVendorIdAsync(int vendorId);

        // History
        Task<VendorHistory> AddHistoryAsync(VendorHistory history);
        Task<List<VendorHistory>> GetHistoryByVendorIdAsync(int vendorId);

        // Reference data
        Task<List<string>> GetCategoriesAsync();
    }
} 