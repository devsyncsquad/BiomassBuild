using Biomass.Server.Models.Customer;
using Biomass.Server.Model;
using Biomass.Server.Models.UserManagement;

namespace Biomass.Server.Models
{
    public class EnhancedAuthenticateResponse
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? DefaultUrl { get; set; }
        public string? Token { get; set; }
        public int? EmpId { get; set; }
        public int? RoleId { get; set; }
        public string? RoleName { get; set; }
        public string? ApplicationVersion { get; set; }
        public string? CanMask { get; set; }
        public string? CanTamper { get; set; }
        public string? CanEdit { get; set; }
        public List<CustomerDto> Customers { get; set; } = new List<CustomerDto>();
        public List<UserAssignedMenus> AssignedMenus { get; set; } = new List<UserAssignedMenus>();

        public EnhancedAuthenticateResponse()
        {
        }

        public EnhancedAuthenticateResponse(AuthenticateResponse baseResponse, List<CustomerDto> customers, List<UserAssignedMenus> assignedMenus)
        {
            UserId = baseResponse.UserId;
            FirstName = baseResponse.FirstName;
            LastName = baseResponse.LastName;
            Username = baseResponse.Username;
            DefaultUrl = baseResponse.DefaultUrl;
            Token = baseResponse.Token;
            EmpId = baseResponse.EmpId;
            RoleId = baseResponse.RoleId;
            RoleName = baseResponse.RoleName;
            ApplicationVersion = baseResponse.ApplicationVersion;
            CanMask = baseResponse.CanMask;
            CanTamper = baseResponse.CanTamper;
            CanEdit = baseResponse.CanEdit;
            Customers = customers;
            AssignedMenus = assignedMenus;
        }
    }
}
