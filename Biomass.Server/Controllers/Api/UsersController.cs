using Biomass.Server.Data;
using Biomass.Server.Model;
using Biomass.Server.Models;
using Biomass.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Biomass.Server.Models.UserManagement;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Customer;

namespace Biomass.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        //private IUserService _userService;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(ApplicationDbContext context, IConfiguration configuration)
        {
            //_userService = userService;
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Authenticate")]
        public async Task<IActionResult> Authenticate(AuthenticateRequest model)
        {
            try
            {
                // Find user by username
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == model.Username && u.Enabled == "Y");

                if (user == null)
                {
                    return BadRequest(new { message = "Invalid username or password" });
                }

                // Verify password (assuming password is stored as hash)
                if (!VerifyPassword(model.Password, user.PasswordHash))
                {
                    return BadRequest(new { message = "Invalid username or password" });
                }

                // Generate JWT token
                var token = GenerateJwtToken(user);

                // Create base response
                var baseResponse = new AuthenticateResponse(user, token);

                // Get user's customers
                var customers = await GetUserCustomersAsync(user.UserId);

                // Get user's assigned menus based on their role
                var assignedMenus = await GetUserAssignedMenusByRoleAsync(user.RoleId ?? 0);

                // Create enhanced response with customers and assigned menus
                var enhancedResponse = new EnhancedAuthenticateResponse(baseResponse, customers, assignedMenus);

                return Ok(baseResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Authentication failed: {ex.Message}" });
            }
        }

        private async Task<List<CustomerDto>> GetUserCustomersAsync(int userId)
        {
            try
            {
                var userCustomers = await _context.UserCustomers
                    .Where(uc => uc.UserId == userId && uc.Enabled)
                    .Include(uc => uc.Customer)
                    .Select(uc => new CustomerDto
                    {
                        CustomerId = uc.Customer.CustomerId,
                        FirstName = uc.Customer.FirstName,
                        LastName = uc.Customer.LastName,
                        Email = uc.Customer.Email,
                        Phone = uc.Customer.Phone,
                        CompanyName = uc.Customer.CompanyName,
                        Address = uc.Customer.Address,
                        City = uc.Customer.City,
                        State = uc.Customer.State,
                        PostalCode = uc.Customer.PostalCode,
                        Country = uc.Customer.Country,
                        Status = uc.Customer.Status,
                        CreatedDate = uc.Customer.CreatedDate,
                        LocationCount = 0 // Will be calculated separately if needed
                    })
                    .ToListAsync();

                return userCustomers;
            }
            catch (Exception ex)
            {
                // Log the exception in production
                // For now, return empty list if there's an error
                return new List<CustomerDto>();
            }
        }

        private async Task<List<VUserMainMenu>> GetUserAssignedMenusAsync(int userId)
        {
            try
            {
                // First get the user's role
                var userRole = await _context.UserRoles
                    .Where(ur => ur.UserId == userId && ur.Enabled == "Y")
                    .FirstOrDefaultAsync();

                if (userRole == null)
                {
                    return new List<VUserMainMenu>();
                }

                // Get menus assigned to this role through MenuRoles table
                var assignedMenuIds = await _context.MenuRoles
                    .Where(mr => mr.RoleId == userRole.RoleId)
                    .Select(mr => mr.MenuId)
                    .ToListAsync();

                // Get the actual menu details for assigned menus
                var assignedMenus = await _context.Menus
                    .Where(m => assignedMenuIds.Contains(m.MenuId) && m.IsEnabled == "Y")
                    .OrderBy(m => m.OrderNo)
                    .Select(m => new VUserMainMenu
                    {
                        MainMenuId = m.MenuId,
                        MainMenuDesc = m.MenuName,
                        MainIcon = m.IconUrl,
                        //Link = m.Link,
                        //OrderNo = m.OrderNo ?? 0,
                        //Enabled = m.IsEnabled
                    })
                    .ToListAsync();

                return assignedMenus;
            }
            catch (Exception ex)
            {
                // Log the exception in production
                // For now, return empty list if there's an error
                return new List<VUserMainMenu>();
            }
        }

        private async Task<List<UserAssignedMenus>> GetUserAssignedMenusByRoleAsync(int roleId)
        {
            try
            {
                // Use the new API endpoint to get assigned menus
                var assignedMenus = await _context.MenuRoles
                    .Where(mr => mr.RoleId == roleId)
                    .Join(_context.Menus,
                          mr => mr.MenuId,
                          m => m.MenuId,
                          (mr, m) => new UserAssignedMenus
                          {
                              MenuId = m.MenuId,
                              MenuName = m.MenuName,
                              IconUrl = m.IconUrl,
                              Link = m.Link,
                              OrderNo = m.OrderNo,
                              IsEnabled = m.IsEnabled,
                              RoleId = mr.RoleId
                          })
                    .Where(m => m.IsEnabled == "Y")
                    .OrderBy(m => m.OrderNo)
                    .ToListAsync();

                return assignedMenus;
            }
            catch (Exception ex)
            {
                // Log the exception in production
                // For now, return empty list if there's an error
                return new List<UserAssignedMenus>();
            }
        }

        private bool VerifyPassword(string inputPassword, string storedHash)
        {
            // For now, simple comparison. In production, use proper password hashing
            // You should implement proper password verification here
            return inputPassword == storedHash;
        }

        private string GenerateJwtToken(Users user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Name, user.Username ?? ""),
                    new Claim(ClaimTypes.GivenName, user.FirstName ?? ""),
                    new Claim(ClaimTypes.Surname, user.LastName ?? ""),
                    new Claim("EmpNo", user.EmpNo?.ToString() ?? ""),
                    new Claim("RoleId", user.RoleId?.ToString() ?? "")
                }),
                Expires = DateTime.UtcNow.AddHours(24), // 24 hours expiration
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}