using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Biomass.Server.Models.Vendor;

namespace Biomass.Server.Interfaces
{
    public interface IVendorService
    {
        // Core operations
        Task<VendorDto> CreateVendorAsync(CreateVendorRequest request, int userId);
        Task<VendorDto> UpdateVendorAsync(int id, UpdateVendorRequest request, int userId);
        Task<bool> DeleteVendorAsync(int id, int userId);
        Task<VendorDto> GetVendorByIdAsync(int id);

        // Search and filter
        Task<List<VendorDto>> GetVendorsAsync(VendorSearchRequest request);
        Task<List<VendorDto>> SearchVendorsAsync(string term);
        Task<List<VendorDto>> GetVendorsByStatusAsync(string status);
        Task<List<VendorDto>> GetVendorsByCategoryAsync(string category);

        // Statistics
        Task<VendorStatisticsDto> GetVendorStatisticsAsync();

        // Documents
        Task<VendorDocumentDto> UploadDocumentAsync(int vendorId, CreateVendorDocumentRequest request, int userId);
        Task<bool> VerifyDocumentAsync(int documentId, int userId);
        Task<List<VendorDocumentDto>> GetVendorDocumentsAsync(int vendorId);

        // Related data
        Task<VendorContactDto> AddContactAsync(int vendorId, CreateVendorContactRequest request, int userId);
        Task<List<VendorContactDto>> GetVendorContactsAsync(int vendorId);
        //Task<VendorServiceDto> AddServiceAsync(int vendorId, CreateVendorServiceRequest request, int userId);
        //Task<List<VendorServiceDto>> GetVendorServicesAsync(int vendorId);
        Task<VendorReviewDto> AddReviewAsync(int vendorId, CreateVendorReviewRequest request, int userId);
        Task<List<VendorReviewDto>> GetVendorReviewsAsync(int vendorId);
        Task<bool> ApproveReviewAsync(int reviewId, int userId);

        // History
        Task<List<VendorHistoryDto>> GetVendorHistoryAsync(int vendorId);

        // Bulk operations
        //Task<bool> BulkUpdateStatusAsync(BulkVendorStatusUpdateRequest request, int userId);

        // Export
        Task<byte[]> ExportVendorsAsync(VendorExportRequest request);

        // Reference data
        Task<List<string>> GetVendorCategoriesAsync();
    }
}
