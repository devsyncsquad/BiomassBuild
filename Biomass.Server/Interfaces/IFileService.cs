using Microsoft.AspNetCore.Http;

namespace Biomass.Server.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string directory);
        Task<bool> DeleteFileAsync(string filePath);
        string GetWebRootPath();
    }
}
