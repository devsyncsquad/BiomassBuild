
using Biomass.Server.Models.Company;
using Biomass.Server.Models.UserManagement;

namespace Biomass.Server.Model
{
    public class AuthenticateResponse
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? DefaultUrl { get; set; }
        public string? Token { get; set; }
        public int? RoleId { get; set; }
        public string? RoleName { get; set; }
        public int? EmpId { get; set; }
        public string? ApplicationVersion { get; set; }
        public string? CanMask { get; set; }
        public string? CanTamper { get; set; }
        public string? CanEdit { get; set; }

        public AuthenticateResponse(Users? user, string? token, string? roleName = null)
        {
            if (user != null)
            {
                UserId = user.UserId;
                FirstName = user.FirstName;
                LastName = user.LastName;
                Username = user.Username;
                EmpId = user.EmpNo;
                RoleId = user.RoleId;
                RoleName = roleName;
            }
            Token = token;
        }
    }
}





