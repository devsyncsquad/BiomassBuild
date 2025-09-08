using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Models.Vendor;
using Biomass.Server.Models;
using Biomass.Server.Interfaces;
using Biomass.Api.Model;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/vendors")]
    public class VendorsController : ControllerBase
    {
        private readonly IVendorService _vendorService;
        private readonly IFileService _fileService;

        public VendorsController(IVendorService vendorService, IFileService fileService)
        {
            _vendorService = vendorService;
            _fileService = fileService;
        }

        /// <summary>
        /// Get all vendors with optional filtering
        /// </summary>
        [HttpGet("all")]
        public async Task<ActionResult<ServiceResponse<List<VendorDto>>>> GetAllVendors()
        {
            try
            {
                var result = await _vendorService.GetAllVendorsAsync();
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
        /// Get vendor by ID
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ServiceResponse<VendorDto>>> GetVendorById(int id)
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
        /// Create a new vendor with file uploads
        /// </summary>
        [HttpPost("create")]
        public async Task<ActionResult<ServiceResponse<VendorDto>>> CreateVendor([FromForm] CreateVendorRequest request)
        {
            try
            {
                var vendor = await _vendorService.CreateVendorAsync(request, GetCurrentUserId());
                return CreatedAtAction(nameof(GetVendorById), new { id = vendor.VendorId }, new ServiceResponse<VendorDto>
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

        /// <summary>
        /// Update an existing vendor with file uploads
        /// </summary>
        [HttpPut("update/{id:int}")]
        public async Task<ActionResult<ServiceResponse<VendorDto>>> UpdateVendor(int id, [FromForm] UpdateVendorRequest request)
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
        /// Delete a vendor
        /// </summary>
        [HttpDelete("delete/{id:int}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteVendor(int id)
        {
            try
            {
                // TODO: Implement delete functionality in VendorService
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
        /// Get vendor image by filename
        /// </summary>
        [HttpGet("images/{fileName}")]
        public async Task<IActionResult> GetVendorImage(string fileName)
        {
            try
            {
                var webRootPath = _fileService.GetWebRootPath();
                var filePath = Path.Combine(webRootPath, "uploads", "vendors", "cnic", fileName);
                
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("Image not found");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                var contentType = GetContentType(fileName);
                
                return File(fileBytes, contentType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error retrieving image");
            }
        }

        /// <summary>
        /// Search vendors by name, address, or CNIC
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

                // TODO: Implement search functionality in VendorService
                var result = await _vendorService.GetAllVendorsAsync();
                var filteredVendors = result.Where(v => 
                    v.VendorName?.Contains(term, StringComparison.OrdinalIgnoreCase) == true ||
                    v.Address?.Contains(term, StringComparison.OrdinalIgnoreCase) == true ||
                    v.Cnic?.Contains(term, StringComparison.OrdinalIgnoreCase) == true
                ).ToList();

                return Ok(new ServiceResponse<List<VendorDto>>
                {
                    Success = true,
                    Result = filteredVendors,
                    Message = "Vendors search completed successfully"
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
        /// Get vendors by status
        /// </summary>
        [HttpGet("by-status/{status}")]
        public async Task<ActionResult<ServiceResponse<List<VendorDto>>>> GetVendorsByStatus(string status)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(status))
                {
                    return BadRequest(new ServiceResponse<List<VendorDto>>
                    {
                        Success = false,
                        Message = "Status is required"
                    });
                }

                // TODO: Implement status filtering in VendorService
                var result = await _vendorService.GetAllVendorsAsync();
                var filteredVendors = result.Where(v => 
                    v.Status?.Equals(status, StringComparison.OrdinalIgnoreCase) == true
                ).ToList();

                return Ok(new ServiceResponse<List<VendorDto>>
                {
                    Success = true,
                    Result = filteredVendors,
                    Message = $"Vendors with status '{status}' retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<List<VendorDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving vendors by status"
                });
            }
        }

        /// <summary>
        /// Get vendor statistics
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult<ServiceResponse<object>>> GetVendorStatistics()
        {
            try
            {
                var allVendors = await _vendorService.GetAllVendorsAsync();
                
                var statistics = new
                {
                    Total = allVendors.Count,
                    Active = allVendors.Count(v => v.Status?.Equals("Active", StringComparison.OrdinalIgnoreCase) == true),
                    Pending = allVendors.Count(v => v.Status?.Equals("Pending", StringComparison.OrdinalIgnoreCase) == true),
                    Inactive = allVendors.Count(v => v.Status?.Equals("Inactive", StringComparison.OrdinalIgnoreCase) == true),
                    VehicleLoaders = allVendors.Count(v => v.IsVehicleLoader == true),
                    Labour = allVendors.Count(v => v.IsLabour == true)
                };

                return Ok(new ServiceResponse<object>
                {
                    Success = true,
                    Result = statistics,
                    Message = "Vendor statistics retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while retrieving vendor statistics"
                });
            }
        }

        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream"
            };
        }

        private int GetCurrentUserId()
        {
            // TODO: Implement user ID extraction from JWT token
            return 1; // Placeholder
        }
    }
}