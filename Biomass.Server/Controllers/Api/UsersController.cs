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

        [HttpPost("authenticate")]
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

                // Create response
                var response = new AuthenticateResponse(user, token);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Authentication failed: {ex.Message}" });
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