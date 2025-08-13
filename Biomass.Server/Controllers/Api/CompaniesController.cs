using Biomass.Api.Model;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Company;
using Biomass.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Biomass.Server.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        private readonly IFileService _fileService;

        public CompaniesController(ICompanyService companyService, IFileService fileService)
        {
            _companyService = companyService;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCompanies()
        {
            var response = await _companyService.GetAllCompaniesAsync();
            
            if (!response.Success)
                return BadRequest(response);
                
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            var response = await _companyService.GetCompanyByIdAsync(id);
            
            if (!response.Success)
                return NotFound(response);
                
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _companyService.CreateCompanyAsync(request);
            
            if (!response.Success)
                return BadRequest(response);
                
            return CreatedAtAction(nameof(GetCompanyById), new { id = response.Result.CompanyId }, response);
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateCompany(int id, [FromBody] UpdateCompanyRequest request)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    if (id != request.CompanyId)
        //        return BadRequest("ID mismatch");

        //    var response = await _companyService.UpdateCompanyAsync(request);
            
        //    if (!response.Success)
        //        return NotFound(response);
                
        //    return Ok(response);
        //}

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var response = await _companyService.DeleteCompanyAsync(id);
            
            if (!response.Success)
                return NotFound(response);
                
            return Ok(response);
        }

        //[HttpGet("search")]
        //public async Task<IActionResult> SearchCompanies(
        //    [FromQuery] string? searchTerm,
        //    [FromQuery] string? industry,
        //    [FromQuery] string? companySize,
        //    [FromQuery] string? location)
        //{
        //    var response = await _companyService.SearchCompaniesAsync(searchTerm, industry, companySize, location);
            
        //    if (!response.Success)
        //        return BadRequest(response);
                
        //    return Ok(response);
        //}

        //[HttpPost("{id}/logo")]
        //public async Task<IActionResult> UploadLogo(int id, IFormFile logo)
        //{
        //    if (logo == null || logo.Length == 0)
        //        return BadRequest(new ServiceResponse<bool>
        //        {
        //            Success = false,
        //            Message = "No file uploaded"
        //        });

        //    // Validate file type
        //    if (!_fileService.IsValidImageFile(logo))
        //        return BadRequest(new ServiceResponse<bool>
        //        {
        //            Success = false,
        //            Message = "Invalid file type. Please upload an image file (JPG, PNG, GIF, BMP)"
        //        });

        //    // Validate file size (5MB max)
        //    if (!_fileService.IsValidFileSize(logo, 5 * 1024 * 1024))
        //        return BadRequest(new ServiceResponse<bool>
        //        {
        //            Success = false,
        //            Message = "File size too large. Maximum size is 5MB"
        //        });

        //    try
        //    {
        //        // Save file to disk
        //        var fileName = await _fileService.SaveFileAsync(logo, "uploads/companies/logos");

        //        // Update company with logo path
        //        var response = await _companyService.UpdateCompanyLogoAsync(id, fileName);
                
        //        if (!response.Success)
        //            return NotFound(response);
                    
        //        return Ok(new ServiceResponse<bool>
        //        {
        //            Success = true,
        //            Result = true,
        //            Message = "Logo uploaded successfully"
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new ServiceResponse<bool>
        //        {
        //            Success = false,
        //            Message = $"Error uploading logo: {ex.Message}"
        //        });
        //    }
        //}

        [HttpGet("{id}/logo")]
        public async Task<IActionResult> GetLogo(int id)
        {
            var response = await _companyService.GetCompanyByIdAsync(id);
            
            if (!response.Success)
                return NotFound(response);

            if (string.IsNullOrEmpty(response.Result?.LogoPath))
                return NotFound(new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Logo not found"
                });

            try
            {
                // Get the web root path
                var webRootPath = _fileService.GetWebRootPath();
                var filePath = Path.Combine(webRootPath, response.Result.LogoPath);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound(new ServiceResponse<bool>
                    {
                        Success = false,
                        Message = "Logo file not found on disk"
                    });
                }

                // Determine content type based on file extension
                var extension = Path.GetExtension(filePath).ToLowerInvariant();
                var contentType = extension switch
                {
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    ".gif" => "image/gif",
                    ".bmp" => "image/bmp",
                    _ => "application/octet-stream"
                };

                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                return File(fileBytes, contentType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ServiceResponse<bool>
                {
                    Success = false,
                    Message = $"Error retrieving logo: {ex.Message}"
                });
            }
        }
    }
} 