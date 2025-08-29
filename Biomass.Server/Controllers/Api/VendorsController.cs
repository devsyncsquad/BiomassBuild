using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Biomass.Server.Models.Vendor;
using Biomass.Server.Models;
using Biomass.Server.Interfaces;
using Biomass.Api.Model;

namespace Biomass.Server.Controllers.Api
{
    [ApiController]
    [Route("api/vendors")]
    public class VendorsController : ControllerBase
    {
        private readonly IVendorService _vendorService;

        public VendorsController(IVendorService vendorService)
        {
            _vendorService = vendorService;
        }

        /// <summary>
        /// Get all vendors
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
        [HttpPost("create")]
        public async Task<ActionResult<ServiceResponse<VendorDto>>> CreateVendor([FromBody] CreateVendorRequest request)
        {
            try
            {
                var vendor = await _vendorService.CreateVendorAsync(request, GetCurrentUserId());
                return CreatedAtAction(nameof(GetVendor), new { id = vendor.VendorId }, new ServiceResponse<VendorDto>
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
        /// Update an existing vendor
        /// </summary>
        [HttpPut("update/{id}")]
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

        private int GetCurrentUserId()
        {
            // TODO: Implement user ID extraction from JWT token
            return 1; // Placeholder
        }
    }
}