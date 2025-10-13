using Biomass.Server.Interfaces;
using Microsoft.AspNetCore.Http;
using System;

namespace Biomass.Server.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<byte[]> ConvertFileToByteArrayAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folderPath)
        {
            if (file == null || file.Length == 0)
                return null;

            // Use ContentRootPath for uploads (consistent with other services)
            // This keeps all user uploads outside of wwwroot for better security and organization
            var contentRootPath = _environment.ContentRootPath;
            if (string.IsNullOrEmpty(contentRootPath))
            {
                contentRootPath = Directory.GetCurrentDirectory();
                Console.WriteLine($"SaveFileAsync: Using fallback path: {contentRootPath}");
            }

            // Create directory if it doesn't exist
            var uploadPath = Path.Combine(contentRootPath, folderPath);
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return fileName;
        }

        public async Task<bool> DeleteFileAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return false;

            // Use ContentRootPath for uploads (consistent with other services)
            var contentRootPath = _environment.ContentRootPath;
            if (string.IsNullOrEmpty(contentRootPath))
            {
                contentRootPath = Directory.GetCurrentDirectory();
            }

            var fullPath = Path.Combine(contentRootPath, filePath);
            if (File.Exists(fullPath))
            {
                try
                {
                    File.Delete(fullPath);
                    return true;
                }
                catch
                {
                    return false;
                }
            }
            return false;
        }

        public bool IsValidImageFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return false;

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            return allowedExtensions.Contains(fileExtension);
        }

        public bool IsValidFileSize(IFormFile file, long maxSizeInBytes)
        {
            if (file == null)
                return false;

            return file.Length <= maxSizeInBytes;
        }

        public async Task<string> SaveCnicImageAsync(IFormFile file, string folderPath, string imageType)
        {
            if (file == null || file.Length == 0)
                return null;

            // Use ContentRootPath for uploads (consistent with other services)
            // This keeps all user uploads outside of wwwroot for better security and organization
            var contentRootPath = _environment.ContentRootPath;
            if (string.IsNullOrEmpty(contentRootPath))
            {
                contentRootPath = Directory.GetCurrentDirectory();
                Console.WriteLine($"SaveCnicImageAsync: Using fallback path: {contentRootPath}");
            }

            // Create directory if it doesn't exist
            var uploadPath = Path.Combine(contentRootPath, folderPath);
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            // Generate filename with format: Cnic_front_ddmmyyyyhhss or Cnic_back_ddmmyyyyhhss
            var now = DateTime.Now;
            var timestamp = now.ToString("ddMMyyyyHHmmss");
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"Cnic_{imageType}_{timestamp}{fileExtension}";
            var filePath = Path.Combine(uploadPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return fileName;
        }

        public string GetWebRootPath()
        {
            // Updated to return ContentRootPath for consistency with all upload services
            // This keeps all user uploads outside of wwwroot for better security and organization
            var contentRootPath = _environment.ContentRootPath;
            if (string.IsNullOrEmpty(contentRootPath))
            {
                contentRootPath = Directory.GetCurrentDirectory();
            }
            return contentRootPath;
        }
    }
}
