using Microsoft.AspNetCore.Http;

namespace Biomass.Server.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string directory);
        Task<string> SaveCnicImageAsync(IFormFile file, string folderPath, string imageType);
        Task<bool> DeleteFileAsync(string filePath);
        string GetWebRootPath();
    }
}
