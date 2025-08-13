using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Biomass.Server.Models.Vendor;
using Biomass.Server.Models;
using Biomass.Server.Interfaces;
//using IFileService = Biomass.Server.Interfaces.IFileService;
using Biomass.Server.Repository;
using TechTalk.SpecFlow.Analytics.UserId;
using Biomass.Api.Model;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VendorsController : ControllerBase
    {
        private readonly IVendorService _vendorService;
        //private readonly IFileService _fileService;
        //private readonly IFileService _fileService;

        public VendorsController(IVendorService vendorService)
        {
            _vendorService = vendorService;
            //_fileService = fileService;
        }

        /// <summary>
        /// Get all vendors with pagination and filtering
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<VendorDto>>>> GetVendors([FromQuery] VendorSearchRequest request)
        {
            try
            {
                var result = await _vendorService.GetVendorsAsync(request);
                return Ok(new ServiceResponse<List<VendorDto>>
                {
                    Success = true,
                    Result = result,
                    Message = "Vendors retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<VendorDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving vendors"
                });
            }
        }

        /// <summary>
        /// Get vendor by ID with all related Result
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<VendorDto>>> GetVendor(int id)
        {
            try
            {
                var vendor = await _vendorService.GetVendorByIdAsync(id);
                if (vendor == null)
                {
                    return NotFound(new ServiceResponse<VendorDto>
                    {
                        Success = false,
                        Message = "Vendor not found"
                    });
                }

                return Ok(new ServiceResponse<VendorDto>
                {
                    Success = true,
                    Result = vendor,
                    Message = "Vendor retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<VendorDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving vendor"
                });
            }
        }

        /// <summary>
        /// Create a new vendor
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ServiceResponse<VendorDto>>> CreateVendor([FromBody] CreateVendorRequest request)
        {
            try
            {
                var vendor = await _vendorService.CreateVendorAsync(request, GetCurrentUserId());
                return CreateResultction(nameof(GetVendor), new { id = vendor.VendorId }, new ServiceResponse<VendorDto>
                {
                    Success = true,
                    Result = vendor,
                    Message = "Vendor created successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ServiceResponse<VendorDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<VendorDto>
                {
                    Success = false,
                    Message = "An error occurred while creating vendor"
                });
            }
        }

        private ActionResult<ServiceResponse<VendorDto>> CreateResultction(string v, object value, ServiceResponse<VendorDto> serviceResponse)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Update an existing vendor
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<VendorDto>>> UpdateVendor(int id, [FromBody] UpdateVendorRequest request)
        {
            try
            {
                var vendor = await _vendorService.UpdateVendorAsync(id, request, GetCurrentUserId());
                if (vendor == null)
                {
                    return NotFound(new ServiceResponse<VendorDto>
                    {
                        Success = false,
                        Message = "Vendor not found"
                    });
                }

                return Ok(new ServiceResponse<VendorDto>
                {
                    Success = true,
                    Result = vendor,
                    Message = "Vendor updated successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ServiceResponse<VendorDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<VendorDto>
                {
                    Success = false,
                    Message = "An error occurred while updating vendor"
                });
            }
        }

        /// <summary>
        /// Delete a vendor (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteVendor(int id)
        {
            try
            {
                var result = await _vendorService.DeleteVendorAsync(id, GetCurrentUserId());
                if (!result)
                {
                    return NotFound(new ServiceResponse<bool>
                    {
                        Success = false,
                        Message = "Vendor not found"
                    });
                }

                return Ok(new ServiceResponse<bool>
                {
                    Success = true,
                    Result = true,
                    Message = "Vendor deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting vendor"
                });
            }
        }

        /// <summary>
        /// Get vendor statistics
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult<ServiceResponse<VendorStatisticsDto>>> GetVendorStatistics()
        {
            try
            {
                var statistics = await _vendorService.GetVendorStatisticsAsync();
                return Ok(new ServiceResponse<VendorStatisticsDto>
                {
                    Success = true,
                    Result = statistics,
                    Message = "Vendor statistics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<VendorStatisticsDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving statistics"
                });
            }
        }

        /// <summary>
        /// Get vendors by status
        /// </summary>
        [HttpGet("by-status/{status}")]
        public async Task<ActionResult<ServiceResponse<List<VendorDto>>>> GetVendorsByStatus(string status)
        {
            try
            {
                var vendors = await _vendorService.GetVendorsByStatusAsync(status);
                return Ok(new ServiceResponse<List<VendorDto>>
                {
                    Success = true,
                    Result = vendors,
                    Message = $"Vendors with status '{status}' retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<VendorDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving vendors"
                });
            }
        }

        /// <summary>
        /// Get vendors by category
        /// </summary>
        [HttpGet("by-category/{category}")]
        public async Task<ActionResult<ServiceResponse<List<VendorDto>>>> GetVendorsByCategory(string category)
        {
            try
            {
                var vendors = await _vendorService.GetVendorsByCategoryAsync(category);
                return Ok(new ServiceResponse<List<VendorDto>>
                {
                    Success = true,
                    Result = vendors,
                    Message = $"Vendors in category '{category}' retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<VendorDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving vendors"
                });
            }
        }

        /// <summary>
        /// Search vendors by name, code, or address
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<ServiceResponse<List<VendorDto>>>> SearchVendors([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                {
                    return BadRequest(new ServiceResponse<List<VendorDto>>
                    {
                        Success = false,
                        Message = "Search term is required"
                    });
                }

                var vendors = await _vendorService.SearchVendorsAsync(term);
                return Ok(new ServiceResponse<List<VendorDto>>
                {
                    Success = true,
                    Result = vendors,
                    Message = $"Search results for '{term}' retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<VendorDto>>
                {
                    Success = false,
                    Message = "An error occurred while searching vendors"
                });
            }
        }

        /// <summary>
        /// Upload vendor document
        /// </summary>
        [HttpPost("{id}/documents")]
        public async Task<ActionResult<ServiceResponse<VendorDocumentDto>>> UploadDocument(int id, [FromForm] CreateVendorDocumentRequest request)
        {
            try
            {
                var document = await _vendorService.UploadDocumentAsync(id, request, GetCurrentUserId());
                return Ok(new ServiceResponse<VendorDocumentDto>
                {
                    Success = true,
                    Result = document,
                    Message = "Document uploaded successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ServiceResponse<VendorDocumentDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<VendorDocumentDto>
                {
                    Success = false,
                    Message = "An error occurred while uploading document"
                });
            }
        }

        /// <summary>
        /// Get vendor documents
        /// </summary>
        [HttpGet("{id}/documents")]
        public async Task<ActionResult<ServiceResponse<List<VendorDocumentDto>>>> GetVendorDocuments(int id)
        {
            try
            {
                var documents = await _vendorService.GetVendorDocumentsAsync(id);
                return Ok(new ServiceResponse<List<VendorDocumentDto>>
                {
                    Success = true,
                    Result = documents,
                    Message = "Vendor documents retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<VendorDocumentDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving documents"
                });
            }
        }

        /// <summary>
        /// Verify vendor document
        /// </summary>
        [HttpPut("documents/{documentId}/verify")]
        public async Task<ActionResult<ServiceResponse<bool>>> VerifyDocument(int documentId)
        {
            try
            {
                var result = await _vendorService.VerifyDocumentAsync(documentId, GetCurrentUserId());
                return Ok(new ServiceResponse<bool>
                {
                    Success = true,
                    Result = result,
                    Message = "Document verified successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ServiceResponse<bool>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while verifying document"
                });
            }
        }

        /// <summary>
        /// Add vendor contact
        /// </summary>
        [HttpPost("{id}/contacts")]
        public async Task<ActionResult<ServiceResponse<VendorContactDto>>> AddContact(int id, [FromBody] CreateVendorContactRequest request)
        {
            try
            {
                var contact = await _vendorService.AddContactAsync(id, request, GetCurrentUserId());
                return Ok(new ServiceResponse<VendorContactDto>
                {
                    Success = true,
                    Result = contact,
                    Message = "Contact added successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ServiceResponse<VendorContactDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<VendorContactDto>
                {
                    Success = false,
                    Message = "An error occurred while adding contact"
                });
            }
        }

        /// <summary>
        /// Get vendor contacts
        /// </summary>
        [HttpGet("{id}/contacts")]
        public async Task<ActionResult<ServiceResponse<List<VendorContactDto>>>> GetVendorContacts(int id)
        {
            try
            {
                var contacts = await _vendorService.GetVendorContactsAsync(id);
                return Ok(new ServiceResponse<List<VendorContactDto>>
                {
                    Success = true,
                    Result = contacts,
                    Message = "Vendor contacts retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<VendorContactDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving contacts"
                });
            }
        }

        /// <summary>
        /// Add vendor service
        /// </summary>
        //[HttpPost("{id}/services")]
        //public async Task<ActionResult<ServiceResponse<VendorServiceDto>>> AddService(int id, [FromBody] CreateVendorServiceRequest request)
        //{
        //    try
        //    {
        //        var service = await _vendorService.AddServiceAsync(id, request, GetCurrentUserId());
        //        return Ok(new ServiceResponse<VendorServiceDto>
        //        {
        //            Success = true,
        //            Result = service,
        //            Message = "Service added successfully"
        //        });
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        return BadRequest(new ServiceResponse<VendorServiceDto>
        //        {
        //            Success = false,
        //            Message = ex.Message
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new ServiceResponse<VendorServiceDto>
        //        {
        //            Success = false,
        //            Message = "An error occurred while adding service"
        //        });
        //    }
        //}

        /// <summary>
        /// Get vendor services
        /// </summary>
        //[HttpGet("{id}/services")]
        //public async Task<ActionResult<ServiceResponse<List<VendorServiceDto>>>> GetVendorServices(int id)
        //{
        //    try
        //    {
        //        var services = await _vendorService.GetVendorServicesAsync(id);
        //        return Ok(new ServiceResponse<List<VendorServiceDto>>
        //        {
        //            Success = true,
        //            Result = services,
        //            Message = "Vendor services retrieved successfully"
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new ServiceResponse<List<VendorServiceDto>>
        //        {
        //            Success = false,
        //            Message = "An error occurred while retrieving services"
        //        });
        //    }
        //}

        /// <summary>
        /// Add vendor review
        /// </summary>
        [HttpPost("{id}/reviews")]
        public async Task<ActionResult<ServiceResponse<VendorReviewDto>>> AddReview(int id, [FromBody] CreateVendorReviewRequest request)
        {
            try
            {
                var review = await _vendorService.AddReviewAsync(id, request, GetCurrentUserId());
                return Ok(new ServiceResponse<VendorReviewDto>
                {
                    Success = true,
                    Result = review,
                    Message = "Review added successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ServiceResponse<VendorReviewDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<VendorReviewDto>
                {
                    Success = false,
                    Message = "An error occurred while adding review"
                });
            }
        }

        /// <summary>
        /// Get vendor reviews
        /// </summary>
        [HttpGet("{id}/reviews")]
        public async Task<ActionResult<ServiceResponse<List<VendorReviewDto>>>> GetVendorReviews(int id)
        {
            try
            {
                var reviews = await _vendorService.GetVendorReviewsAsync(id);
                return Ok(new ServiceResponse<List<VendorReviewDto>>
                {
                    Success = true,
                    Result = reviews,
                    Message = "Vendor reviews retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<VendorReviewDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving reviews"
                });
            }
        }

        /// <summary>
        /// Approve vendor review
        /// </summary>
        [HttpPut("reviews/{reviewId}/approve")]
        public async Task<ActionResult<ServiceResponse<bool>>> ApproveReview(int reviewId)
        {
            try
            {
                var result = await _vendorService.ApproveReviewAsync(reviewId, GetCurrentUserId());
                return Ok(new ServiceResponse<bool>
                {
                    Success = true,
                    Result = result,
                    Message = "Review approved successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ServiceResponse<bool>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while approving review"
                });
            }
        }

        /// <summary>
        /// Get vendor history
        /// </summary>
        [HttpGet("{id}/history")]
        public async Task<ActionResult<ServiceResponse<List<VendorHistoryDto>>>> GetVendorHistory(int id)
        {
            try
            {
                var history = await _vendorService.GetVendorHistoryAsync(id);
                return Ok(new ServiceResponse<List<VendorHistoryDto>>
                {
                    Success = true,
                    Result = history,
                    Message = "Vendor history retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<VendorHistoryDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving history"
                });
            }
        }

        /// <summary>
        /// Bulk update vendor status
        /// </summary>
        //[HttpPut("bulk-status")]
        //public async Task<ActionResult<ServiceResponse<bool>>> BulkUpdateStatus([FromBody] BulkVendorStatusUpdateRequest request)
        //{
        //    try
        //    {
        //        var result = await _vendorService.BulkUpdateStatusAsync(request, GetCurrentUserId());
        //        return Ok(new ServiceResponse<bool>
        //        {
        //            Success = true,
        //            Result = result,
        //            Message = "Vendor statuses updated successfully"
        //        });
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        return BadRequest(new ServiceResponse<bool>
        //        {
        //            Success = false,
        //            Message = ex.Message
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new ServiceResponse<bool>
        //        {
        //            Success = false,
        //            Message = "An error occurred while updating statuses"
        //        });
        //    }
        //}

        /// <summary>
        /// Export vendors
        /// </summary>
        [HttpPost("export")]
        public async Task<ActionResult> ExportVendors([FromBody] VendorExportRequest request)
        {
            try
            {
                var fileBytes = await _vendorService.ExportVendorsAsync(request);
                var fileName = $"vendors_export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.{request.ExportFormat.ToLower()}";
                
                return File(fileBytes, GetContentType(request.ExportFormat), fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while exporting vendors"
                });
            }
        }

        /// <summary>
        /// Get vendor categories
        /// </summary>
        [HttpGet("categories")]
        public async Task<ActionResult<ServiceResponse<List<string>>>> GetVendorCategories()
        {
            try
            {
                var categories = await _vendorService.GetVendorCategoriesAsync();
                return Ok(new ServiceResponse<List<string>>
                {
                    Success = true,
                    Result = categories,
                    Message = "Vendor categories retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<string>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving categories"
                });
            }
        }

        /// <summary>
        /// Get vendor statuses
        /// </summary>
        [HttpGet("statuses")]
        public ActionResult<ServiceResponse<List<string>>> GetVendorStatuses()
        {
            try
            {
                var statuses = new List<string> { "Active", "Pending", "Inactive", "Suspended" };
                return Ok(new ServiceResponse<List<string>>
                {
                    Success = true,
                    Result = statuses,
                    Message = "Vendor statuses retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<string>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving statuses"
                });
            }
        }

        private string GetContentType(string format)
        {
            return format.ToLower() switch
            {
                "excel" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "csv" => "text/csv",
                "pdf" => "application/pdf",
                _ => "application/octet-stream"
            };
        }

        private int GetCurrentUserId()
        {
            // TODO: Implement user ID extraction from JWT token
            // This should be implemented based on your authentication system
            return 1; // Placeholder
        }
    }
} 