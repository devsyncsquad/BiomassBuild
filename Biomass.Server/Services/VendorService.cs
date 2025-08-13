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

        public async Task<VendorDto> CreateVendorAsync(CreateVendorRequest request, int userId)
        {
            try
            {
                var vendor = new Vendor
                {
                    VendorName = request.VendorName,
                    VendorCode = GenerateVendorCode(),
                    Category = request.Category,
                    VendorAddress = request.VendorAddress,
                    PrimaryPhone = request.PrimaryPhone,
                    PhoneNumber2 = request.PhoneNumber2,
                    PhoneNumber3 = request.PhoneNumber3,
                    Email = request.Email,
                    Website = request.Website,
                    ContactPerson = request.ContactPerson,
                    ContactPersonPhone = request.ContactPersonPhone,
                    ContactPersonEmail = request.ContactPersonEmail,
                    TaxNumber = request.TaxNumber,
                    BusinessLicense = request.BusinessLicense,
                    BankName = request.BankName,
                    BankAccountNumber = request.BankAccountNumber,
                    BankBranch = request.BankBranch,
                    PaymentTerms = request.PaymentTerms,
                    CreditLimit = request.CreditLimit,
                    Notes = request.Notes,
                    Status = "Active",
                    Rating = 0,
                    TotalProjects = 0,
                    TotalRevenue = 0,
                    IsActive = true,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = userId
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
                    throw new Exception("Vendor not found");

                vendor.VendorName = request.VendorName;
                vendor.Category = request.Category;
                vendor.VendorAddress = request.VendorAddress;
                vendor.PrimaryPhone = request.PrimaryPhone;
                vendor.PhoneNumber2 = request.PhoneNumber2;
                vendor.PhoneNumber3 = request.PhoneNumber3;
                vendor.Email = request.Email;
                vendor.Website = request.Website;
                vendor.ContactPerson = request.ContactPerson;
                vendor.ContactPersonPhone = request.ContactPersonPhone;
                vendor.ContactPersonEmail = request.ContactPersonEmail;
                vendor.TaxNumber = request.TaxNumber;
                vendor.BusinessLicense = request.BusinessLicense;
                vendor.BankName = request.BankName;
                vendor.BankAccountNumber = request.BankAccountNumber;
                vendor.BankBranch = request.BankBranch;
                vendor.PaymentTerms = request.PaymentTerms;
                vendor.CreditLimit = request.CreditLimit;
                vendor.Notes = request.Notes;
                vendor.IsActive = request.IsActive;
                vendor.ModifiedOn = DateTime.UtcNow;
                vendor.ModifiedBy = userId;

                await _context.SaveChangesAsync();

                return await GetVendorByIdAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating vendor: {ex.Message}");
            }
        }

        public async Task<bool> DeleteVendorAsync(int id, int userId)
        {
            try
            {
                var vendor = await _context.Vendors.FindAsync(id);
                if (vendor == null)
                    return false;

                vendor.IsActive = false;
                vendor.Status = "Deleted";
                vendor.ModifiedOn = DateTime.UtcNow;
                vendor.ModifiedBy = userId;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting vendor: {ex.Message}");
            }
        }

        public async Task<VendorDto> GetVendorByIdAsync(int id)
        {
            try
            {
                var vendor = await _context.Vendors
                    .Include(v => v.Contacts)
                    .Include(v => v.Services)
                    .Include(v => v.Documents)
                    .Include(v => v.Reviews)
                    .FirstOrDefaultAsync(v => v.VendorId == id);

                if (vendor == null)
                    return null;

                return MapToVendorDto(vendor);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendor: {ex.Message}");
            }
        }

        public async Task<List<VendorDto>> GetVendorsAsync(VendorSearchRequest request)
        {
            try
            {
                var query = _context.Vendors.AsQueryable();

                if (!string.IsNullOrEmpty(request.SearchTerm))
                {
                    query = query.Where(v => v.VendorName.Contains(request.SearchTerm) ||
                                           v.VendorCode.Contains(request.SearchTerm) ||
                                           v.ContactPerson.Contains(request.SearchTerm));
                }

                if (!string.IsNullOrEmpty(request.Status))
                {
                    query = query.Where(v => v.Status == request.Status);
                }

                if (!string.IsNullOrEmpty(request.Category))
                {
                    query = query.Where(v => v.Category == request.Category);
                }

                if (request.IsActive.HasValue)
                {
                    query = query.Where(v => v.IsActive == request.IsActive.Value);
                }

                // Apply sorting
                query = request.SortBy.ToLower() switch
                {
                    "vendorname" => request.SortOrder.ToUpper() == "ASC" ? query.OrderBy(v => v.VendorName) : query.OrderByDescending(v => v.VendorName),
                    "category" => request.SortOrder.ToUpper() == "ASC" ? query.OrderBy(v => v.Category) : query.OrderByDescending(v => v.Category),
                    "rating" => request.SortOrder.ToUpper() == "ASC" ? query.OrderBy(v => v.Rating) : query.OrderByDescending(v => v.Rating),
                    _ => request.SortOrder.ToUpper() == "ASC" ? query.OrderBy(v => v.CreatedOn) : query.OrderByDescending(v => v.CreatedOn)
                };

                // Apply pagination
                var vendors = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Include(v => v.Contacts)
                    .Include(v => v.Services)
                    .ToListAsync();

                return vendors.Select(MapToVendorDto).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendors: {ex.Message}");
            }
        }

        public async Task<List<VendorDto>> SearchVendorsAsync(string term)
        {
            try
            {
                var vendors = await _context.Vendors
                    .Where(v => v.VendorName.Contains(term) ||
                               v.VendorCode.Contains(term) ||
                               v.ContactPerson.Contains(term) ||
                               v.Category.Contains(term))
                    .Include(v => v.Contacts)
                    .Include(v => v.Services)
                    .ToListAsync();

                return vendors.Select(MapToVendorDto).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error searching vendors: {ex.Message}");
            }
        }

        public async Task<List<VendorDto>> GetVendorsByStatusAsync(string status)
        {
            try
            {
                var vendors = await _context.Vendors
                    .Where(v => v.Status == status)
                    .Include(v => v.Contacts)
                    .Include(v => v.Services)
                    .ToListAsync();

                return vendors.Select(MapToVendorDto).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendors by status: {ex.Message}");
            }
        }

        public async Task<List<VendorDto>> GetVendorsByCategoryAsync(string category)
        {
            try
            {
                var vendors = await _context.Vendors
                    .Where(v => v.Category == category)
                    .Include(v => v.Contacts)
                    .Include(v => v.Services)
                    .ToListAsync();

                return vendors.Select(MapToVendorDto).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendors by category: {ex.Message}");
            }
        }

        public async Task<VendorStatisticsDto> GetVendorStatisticsAsync()
        {
            try
            {
                var vendors = await _context.Vendors.ToListAsync();

                return new VendorStatisticsDto
                {
                    TotalVendors = vendors.Count,
                    ActiveVendors = vendors.Count(v => v.Status == "Active"),
                    PendingVendors = vendors.Count(v => v.Status == "Pending"),
                    InactiveVendors = vendors.Count(v => v.Status == "Inactive"),
                    SuspendedVendors = vendors.Count(v => v.Status == "Suspended"),
                    AverageRating = vendors.Any() ? vendors.Average(v => v.Rating) : 0,
                    TotalProjects = vendors.Sum(v => v.TotalProjects),
                    TotalRevenue = vendors.Sum(v => v.TotalRevenue)
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendor statistics: {ex.Message}");
            }
        }

        public async Task<VendorDocumentDto> UploadDocumentAsync(int vendorId, CreateVendorDocumentRequest request, int userId)
        {
            try
            {
                var vendor = await _context.Vendors.FindAsync(vendorId);
                if (vendor == null)
                    throw new Exception("Vendor not found");

                var document = new VendorDocument
                {
                    VendorId = vendorId,
                    DocumentType = request.DocumentType,
                    DocumentName = request.DocumentName,
                    FileName = request.FileName,
                    FilePath = request.FilePath,
                    FileSize = request.FileSize,
                    ContentType = request.ContentType,
                    IsVerified = false,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = userId
                };

                _context.VendorDocuments.Add(document);
                await _context.SaveChangesAsync();

                return MapToVendorDocumentDto(document);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error uploading document: {ex.Message}");
            }
        }

        public async Task<bool> VerifyDocumentAsync(int documentId, int userId)
        {
            try
            {
                var document = await _context.VendorDocuments.FindAsync(documentId);
                if (document == null)
                    return false;

                document.IsVerified = true;
                document.VerifiedBy = userId;
                document.VerifiedOn = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error verifying document: {ex.Message}");
            }
        }

        public async Task<List<VendorDocumentDto>> GetVendorDocumentsAsync(int vendorId)
        {
            try
            {
                var documents = await _context.VendorDocuments
                    .Where(d => d.VendorId == vendorId)
                    .ToListAsync();

                return documents.Select(MapToVendorDocumentDto).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendor documents: {ex.Message}");
            }
        }

        public async Task<VendorContactDto> AddContactAsync(int vendorId, CreateVendorContactRequest request, int userId)
        {
            try
            {
                var vendor = await _context.Vendors.FindAsync(vendorId);
                if (vendor == null)
                    throw new Exception("Vendor not found");

                var contact = new VendorContact
                {
                    VendorId = vendorId,
                    ContactName = request.ContactName,
                    ContactTitle = request.ContactTitle,
                    ContactPhone = request.ContactPhone,
                    ContactEmail = request.ContactEmail,
                    IsPrimary = request.IsPrimary,
                    IsActive = true,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = userId
                };

                _context.VendorContacts.Add(contact);
                await _context.SaveChangesAsync();

                return MapToVendorContactDto(contact);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding contact: {ex.Message}");
            }
        }

        public async Task<List<VendorContactDto>> GetVendorContactsAsync(int vendorId)
        {
            try
            {
                var contacts = await _context.VendorContacts
                    .Where(c => c.VendorId == vendorId)
                    .ToListAsync();

                return contacts.Select(MapToVendorContactDto).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendor contacts: {ex.Message}");
            }
        }

        //public async Task<VendorServiceDto> AddServiceAsync(int vendorId, CreateVendorServiceRequest request, int userId)
        //{
        //    try
        //    {
        //        var vendor = await _context.Vendors.FindAsync(vendorId);
        //        if (vendor == null)
        //            throw new Exception("Vendor not found");

        //        var service = new VendorService
        //        {
        //            VendorId = vendorId,
        //            ServiceName = request.ServiceName,
        //            ServiceDescription = request.ServiceDescription,
        //            ServiceCategory = request.ServiceCategory,
        //            IsActive = true,
        //            CreatedOn = DateTime.UtcNow,
        //            CreatedBy = userId
        //        };

        //        _context.VendorServices.Add(service);
        //        await _context.SaveChangesAsync();

        //        return MapToVendorServiceDto(service);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception($"Error adding service: {ex.Message}");
        //    }
        //}

        //public async Task<List<VendorServiceDto>> GetVendorServicesAsync(int vendorId)
        //{
        //    try
        //    {
        //        var services = await _context.VendorServices
        //            .Where(s => s.VendorId == vendorId)
        //            .ToListAsync();

        //        return services.Select(MapToVendorServiceDto).ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception($"Error retrieving vendor services: {ex.Message}");
        //    }
        //}

        public async Task<VendorReviewDto> AddReviewAsync(int vendorId, CreateVendorReviewRequest request, int userId)
        {
            try
            {
                var vendor = await _context.Vendors.FindAsync(vendorId);
                if (vendor == null)
                    throw new Exception("Vendor not found");

                var review = new VendorReview
                {
                    VendorId = vendorId,
                    ReviewedBy = userId,
                    Rating = request.Rating,
                    ReviewTitle = request.ReviewTitle,
                    ReviewComment = request.ReviewComment,
                    IsApproved = false,
                    CreatedOn = DateTime.UtcNow
                };

                _context.VendorReviews.Add(review);
                await _context.SaveChangesAsync();

                return MapToVendorReviewDto(review);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding review: {ex.Message}");
            }
        }

        public async Task<List<VendorReviewDto>> GetVendorReviewsAsync(int vendorId)
        {
            try
            {
                var reviews = await _context.VendorReviews
                    .Where(r => r.VendorId == vendorId)
                    .ToListAsync();

                return reviews.Select(MapToVendorReviewDto).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendor reviews: {ex.Message}");
            }
        }

        public async Task<bool> ApproveReviewAsync(int reviewId, int userId)
        {
            try
            {
                var review = await _context.VendorReviews.FindAsync(reviewId);
                if (review == null)
                    return false;

                review.IsApproved = true;
                review.ApprovedBy = userId;
                review.ApprovedOn = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error approving review: {ex.Message}");
            }
        }

        public async Task<List<VendorHistoryDto>> GetVendorHistoryAsync(int vendorId)
        {
            try
            {
                var history = await _context.VendorHistory
                    .Where(h => h.VendorId == vendorId)
                    .OrderByDescending(h => h.ChangedOn)
                    .ToListAsync();

                return history.Select(MapToVendorHistoryDto).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendor history: {ex.Message}");
            }
        }

        //public async Task<bool> BulkUpdateStatusAsync(BulkVendorStatusUpdateRequest request, int userId)
        //{
        //    try
        //    {
        //        var vendors = await _context.Vendors
        //            .Where(v => request.VendorIds.Contains(v.VendorId))
        //            .ToListAsync();

        //        foreach (var vendor in vendors)
        //        {
        //            vendor.Status = request.NewStatus;
        //            vendor.ModifiedOn = DateTime.UtcNow;
        //            vendor.ModifiedBy = userId;
        //        }

        //        await _context.SaveChangesAsync();
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception($"Error updating vendor statuses: {ex.Message}");
        //    }
        //}

        public async Task<byte[]> ExportVendorsAsync(VendorExportRequest request)
        {
            try
            {
                var query = _context.Vendors.AsQueryable();

                if (!string.IsNullOrEmpty(request.Status))
                {
                    query = query.Where(v => v.Status == request.Status);
                }

                if (!string.IsNullOrEmpty(request.Category))
                {
                    query = query.Where(v => v.Category == request.Category);
                }

                if (request.FromDate.HasValue)
                {
                    query = query.Where(v => v.CreatedOn >= request.FromDate.Value);
                }

                if (request.ToDate.HasValue)
                {
                    query = query.Where(v => v.CreatedOn <= request.ToDate.Value);
                }

                var vendors = await query.ToListAsync();

                // For now, return a simple CSV format
                var csv = "VendorId,VendorName,VendorCode,Category,Status,Rating,TotalProjects,TotalRevenue,CreatedOn\n";
                foreach (var vendor in vendors)
                {
                    csv += $"{vendor.VendorId},{vendor.VendorName},{vendor.VendorCode},{vendor.Category},{vendor.Status},{vendor.Rating},{vendor.TotalProjects},{vendor.TotalRevenue},{vendor.CreatedOn:yyyy-MM-dd}\n";
                }

                return System.Text.Encoding.UTF8.GetBytes(csv);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error exporting vendors: {ex.Message}");
            }
        }

        public async Task<List<string>> GetVendorCategoriesAsync()
        {
            try
            {
                return await _context.Vendors
                    .Where(v => !string.IsNullOrEmpty(v.Category))
                    .Select(v => v.Category)
                    .Distinct()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving vendor categories: {ex.Message}");
            }
        }

        private string GenerateVendorCode()
        {
            return $"V{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}";
        }

        private VendorDto MapToVendorDto(Vendor vendor)
        {
            return new VendorDto
            {
                VendorId = vendor.VendorId,
                VendorName = vendor.VendorName,
                VendorCode = vendor.VendorCode,
                Category = vendor.Category,
                VendorAddress = vendor.VendorAddress,
                PrimaryPhone = vendor.PrimaryPhone,
                PhoneNumber2 = vendor.PhoneNumber2,
                PhoneNumber3 = vendor.PhoneNumber3,
                Email = vendor.Email,
                Website = vendor.Website,
                ContactPerson = vendor.ContactPerson,
                ContactPersonPhone = vendor.ContactPersonPhone,
                ContactPersonEmail = vendor.ContactPersonEmail,
                Status = vendor.Status,
                Rating = vendor.Rating,
                TotalProjects = vendor.TotalProjects,
                TotalRevenue = vendor.TotalRevenue,
                TaxNumber = vendor.TaxNumber,
                BusinessLicense = vendor.BusinessLicense,
                BankName = vendor.BankName,
                BankAccountNumber = vendor.BankAccountNumber,
                BankBranch = vendor.BankBranch,
                PaymentTerms = vendor.PaymentTerms,
                CreditLimit = vendor.CreditLimit,
                Notes = vendor.Notes,
                IsActive = vendor.IsActive,
                CreatedOn = vendor.CreatedOn,
                ModifiedOn = vendor.ModifiedOn,
                LastActiveOn = vendor.LastActiveOn,
                DisplayName = vendor.VendorName,
                StatusDisplay = vendor.Status,
                Contacts = vendor.Contacts?.Select(MapToVendorContactDto).ToList() ?? new List<VendorContactDto>(),
                //Services = vendor.Services?.Select(MapToVendorServiceDto).ToList() ?? new List<VendorServiceDto>(),
                Documents = vendor.Documents?.Select(MapToVendorDocumentDto).ToList() ?? new List<VendorDocumentDto>(),
                Reviews = vendor.Reviews?.Select(MapToVendorReviewDto).ToList() ?? new List<VendorReviewDto>()
            };
        }

        private VendorContactDto MapToVendorContactDto(VendorContact contact)
        {
            return new VendorContactDto
            {
                ContactId = contact.ContactId,
                VendorId = contact.VendorId,
                ContactName = contact.ContactName,
                ContactTitle = contact.ContactTitle,
                ContactPhone = contact.ContactPhone,
                ContactEmail = contact.ContactEmail,
                IsPrimary = contact.IsPrimary,
                IsActive = contact.IsActive,
                CreatedOn = contact.CreatedOn
            };
        }

        //private VendorServiceDto MapToVendorServiceDto(VendorService service)
        //{
        //    return new VendorServiceDto
        //    {
        //        ServiceId = service.ServiceId,
        //        VendorId = service.VendorId,
        //        ServiceName = service.ServiceName,
        //        ServiceDescription = service.ServiceDescription,
        //        ServiceCategory = service.ServiceCategory,
        //        IsActive = service.IsActive,
        //        CreatedOn = service.CreatedOn
        //    };
        //}

        private VendorDocumentDto MapToVendorDocumentDto(VendorDocument document)
        {
            return new VendorDocumentDto
            {
                DocumentId = document.DocumentId,
                VendorId = document.VendorId,
                DocumentType = document.DocumentType,
                DocumentName = document.DocumentName,
                FileName = document.FileName,
                FilePath = document.FilePath,
                FileSize = document.FileSize,
                ContentType = document.ContentType,
                IsVerified = document.IsVerified,
                VerifiedBy = document.VerifiedBy,
                VerifiedOn = document.VerifiedOn,
                CreatedOn = document.CreatedOn,
                VerifiedByUserName = document.VerifiedBy?.ToString() // This would need to be populated from Users table
            };
        }

        private VendorReviewDto MapToVendorReviewDto(VendorReview review)
        {
            return new VendorReviewDto
            {
                ReviewId = review.ReviewId,
                VendorId = review.VendorId,
                ReviewedBy = review.ReviewedBy,
                Rating = review.Rating,
                ReviewTitle = review.ReviewTitle,
                ReviewComment = review.ReviewComment,
                IsApproved = review.IsApproved,
                ApprovedBy = review.ApprovedBy,
                ApprovedOn = review.ApprovedOn,
                CreatedOn = review.CreatedOn,
                ReviewedByUserName = review.ReviewedBy.ToString(), // This would need to be populated from Users table
                ApprovedByUserName = review.ApprovedBy?.ToString() // This would need to be populated from Users table
            };
        }

        private VendorHistoryDto MapToVendorHistoryDto(VendorHistory history)
        {
            return new VendorHistoryDto
            {
                HistoryId = history.HistoryId,
                VendorId = history.VendorId,
                Action = history.Action,
                FieldName = history.FieldName,
                OldValue = history.OldValue,
                NewValue = history.NewValue,
                ChangedBy = history.ChangedBy,
                ChangedOn = history.ChangedOn,
                ChangedByUserName = history.ChangedBy.ToString() // This would need to be populated from Users table
            };
        }
    }
}
