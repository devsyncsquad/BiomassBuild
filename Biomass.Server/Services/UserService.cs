//using Biomass.Api.Model.UserManagement;
//using Biomass.Server.Data;
//using Biomass.Server.Model;
//using Biomass.Server.Models;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Options;
//using Microsoft.Extensions.Configuration;
//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace Biomass.Server.Services
//{
//    public class UserService : IUserService
//    {
//        private readonly AppSettings _appSettings;
//        private readonly ApplicationDbContext db;
//        private readonly IHttpContextAccessor _httpContextAccessor;

//        public UserService(IOptions<AppSettings> appSettings, ApplicationDbContext _db, IHttpContextAccessor httpContextAccessor)
//        {
//            _appSettings = appSettings.Value;
//            db = _db;
//            _httpContextAccessor = httpContextAccessor;
//        }

//        public async Task<AuthenticateResponse?> Authenticate(AuthenticateRequest model)
//        {
//            try
//            {
//                Console.WriteLine($"Attempting authentication for user: {model.Username}");
                
//                // Simple authentication bypass for testing
//                // Accept any username/password combination
//                var mockUser = new VUser
//                {
//                    UserId = 1,
//                    UserName = model.Username,
//                    FirstName = "Test",
//                    LastName = "User",
//                    Email = "test@example.com",
//                    IsActive = "1"
//                };

//                Console.WriteLine($"Authentication bypassed - User: {mockUser.UserName}");

//                // Generate JWT token
//                var token = await generateJwtToken(mockUser);
//                var userCompanies = new List<UserCompanies>(); // Empty list for now

//                RecordLoginLog(mockUser.UserId);

//                // Get version from configuration
//                var configuration = new ConfigurationBuilder()
//                    .SetBasePath(Directory.GetCurrentDirectory())
//                    .AddJsonFile("appsettings.json")
//                    .Build();
                
//                string version = configuration["version"] ?? "1.0.0";

//                return new AuthenticateResponse(mockUser, token, userCompanies, version);
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Authentication error: {ex.Message}");
//                return null;
//            }
//        }

//        private void RecordLoginLog(int userId)
//        {
//            try
//            {
//                // Get IP address from the current HTTP request
//                string ipAddress = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();

//                // If IP address is localhost/IPv6, try to get the IPv4 address
//                if (string.IsNullOrEmpty(ipAddress) || ipAddress == "::1")
//                {
//                    ipAddress = "127.0.0.1";
//                }

//                var loginLog = new LoginLog
//                {
//                    UserID = userId,
//                    IPAddress = ipAddress,
//                    LoginTime = DateTime.Now
//                };

//                db.LoginLogs.Add(loginLog);
//                db.SaveChanges();
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error recording login log: {ex.Message}");
//            }
//        }

//        public async Task<IEnumerable<User>> GetAll()
//        {
//            return await db.Users.Where(x => x.IsActive == "Y").ToListAsync();
//        }

//        public async Task<User?> GetById(int id)
//        {
//            return await db.Users.FirstOrDefaultAsync(x => x.UserId == id);
//        }

//        public async Task<User?> AddAndUpdateUser(User userObj)
//        {
//            bool isSuccess = false;
//            if (userObj.UserId > 0)
//            {
//                var obj = await db.Users.FirstOrDefaultAsync(c => c.UserId == userObj.UserId);
//                if (obj != null)
//                {
//                    obj.FirstName = userObj.FirstName;
//                    obj.LastName = userObj.LastName;
//                    db.Users.Update(obj);
//                    isSuccess = await db.SaveChangesAsync() > 0;
//                }
//            }
//            else
//            {
//                await db.Users.AddAsync(userObj);
//                isSuccess = await db.SaveChangesAsync() > 0;
//            }

//            return isSuccess ? userObj : null;
//        }

//        // Helper methods
//        private async Task<string> generateJwtToken(VUser user)
//        {
//            // Generate token that is valid for 1 day
//            var tokenHandler = new JwtSecurityTokenHandler();
//            var token = await Task.Run(() =>
//            {
//                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
//                var tokenDescriptor = new SecurityTokenDescriptor
//                {
//                    Subject = new ClaimsIdentity(new[] { new Claim("userId", user.UserId.ToString()) }),
//                    Expires = DateTime.UtcNow.AddDays(1),
//                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
//                };
//                return tokenHandler.CreateToken(tokenDescriptor);
//            });

//            return tokenHandler.WriteToken(token);
//        }
//    }
//}
