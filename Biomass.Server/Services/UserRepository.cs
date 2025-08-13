//using Biomass.Api.Model;
//using Biomass.Api.Model.UserManagement;
//using Biomass.Server.Data;
//using Biomass.Server.Model;
//using Biomass.Server.Models;
//using Biomass.Server.Services;
//using Microsoft.AspNetCore.Http.HttpResults;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Options;
//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Net;
//using System.Security.Claims;
//using System.Text;

//namespace Biomass.Server.Repository
//{
//    public class UserRepository : IUserService,IDisposable
//    {
//        private readonly AppSettings _appSettings;
//        private readonly ApplicationDbContext db;
//        private bool _disposed = false;

//        public UserRepository(IOptions<AppSettings> appSettings, ApplicationDbContext _db)
//        {
//            _appSettings = appSettings.Value;
//            db = _db;
//        }

//        public void Dispose()
//        {
//            if (!_disposed)
//            {
//                db.Dispose();  // Dispose of the database context
//                _disposed = true;
//                GC.SuppressFinalize(this);
//            }
//        }
//        ~UserRepository()
//        {
//            Dispose();
//        }

//        public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model)
//        {
//            var data = "select * from vusers " +
//                       "where UserName='" + model.Username + "' and passwordHash='" +
//                       model.Password + "' " +
//                       " and IsActive='Y'";

//            var user = db.Database.SqlQueryRaw<VUser>(data).FirstOrDefault();

//            // return null if user not found
//            if (user == null) return null;

//            // authentication successful so generate jwt token
//            var token = await generateJwtToken(user);
//            var userCompanies = db.UserCompanies.Where(x => x.UserID == user.UserId).ToList();

//            // RecordLoginLog(user.UserId);

//            var builder = WebApplication.CreateBuilder();
//            var app = builder.Build();
//            string version = builder.Configuration["version"];


//            return new AuthenticateResponse(user, token, userCompanies, version);
//        }


//        private void RecordLoginLog(int userId)
//        {

//            string hostName = Dns.GetHostName(); // Retrive the Name of HOST
//            Console.WriteLine(hostName);
//            string ipAddress = Dns.GetHostByName(hostName).AddressList[3].ToString();

//            var loginLog = new LoginLog()
//            {
//                UserID = userId,
//                IPAddress = ipAddress,
//                LoginTime = DateTime.Now
//            };
//            db.LoginLogs.Add(loginLog);
//            db.SaveChanges();

//            // var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

//            //  var loginLog = new LoginLog
//            //{
//            //    UserID = user.UserId,
//            //    LoginTime = DateTime.UtcNow,
//            //    IPAddress = ipAddress
//            //};

//            db.LoginLogs.Add(loginLog);
//            db.SaveChanges();

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
//                    // obj.Address = userObj.Address;
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

//        // helper methods
//        private async Task<string> generateJwtToken(VUser user)
//        {
//            //Generate token that is valid for 1 days
//            var tokenHandler = new JwtSecurityTokenHandler();
//            var token = await Task.Run(() =>
//            {

//                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
//                var tokenDescriptor = new SecurityTokenDescriptor
//                {
//                    Subject = new ClaimsIdentity(new[] { new Claim("id", user.UserId.ToString()) }),
//                    Expires = DateTime.UtcNow.AddDays(1),
//                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
//                        SecurityAlgorithms.HmacSha256Signature)
//                };
//                return tokenHandler.CreateToken(tokenDescriptor);
//            });

//            return tokenHandler.WriteToken(token);
//        }

//        public UserMenuList GetUserMenuByEmpId(int userId)
//        {
//            var mainMenu = db.VUserMainMenus.Where(x => x.UserId == userId).ToList();

//            List<VUserMainMenu> ul = new List<VUserMainMenu>();
//            List<VUserSubMenu> sm = new List<VUserSubMenu>();

//            foreach (var item in mainMenu)
//            {
//                VUserMainMenu vm = new VUserMainMenu()
//                {
//                    UserId = item.UserId,
//                    MainMenuId = item.MainMenuId,
//                    MainIcon = item.MainIcon,
//                    MainMenuDesc = item.MainMenuDesc,
//                    //RoleId = item.RoleId
//                };
//                ul.Add(vm);

//                FormattableString qrySubMenu =
//                    $"select * from VUserSubMenu where userId={userId} and mainMenuId={item.MainMenuId} order by OrderNo ";
//                var subMenu = db.Database.SqlQuery<VUserSubMenu>(qrySubMenu);

//                foreach (var itemsm in subMenu)
//                {
//                    VUserSubMenu usm = new VUserSubMenu()
//                    {
//                        SubMenuId = itemsm.SubMenuId,
//                        SubMenuDesc = itemsm.SubMenuDesc,
//                        Icon = itemsm.Icon,
//                        Link = itemsm.Link,
//                        EmpId = itemsm.EmpId,
//                        MainMenuId = itemsm.MainMenuId,
//                        OrderNo = itemsm.OrderNo,
//                        Enabled = itemsm.Enabled,
//                        UserId = itemsm.UserId,
//                        IsActive = itemsm.IsActive,
//                        CompanyId = itemsm.CompanyId,
//                        CompanyName = itemsm.CompanyName

//                    };
//                    sm.Add(usm);
//                    vm.SubMenus.Add(usm);
//                }
//            }

//            return new UserMenuList()
//            {
//                MainMenuModel = ul
//            };
//        }

//        public List<VUserSubMenu> GetUserSubMenuByUserId(int userId)
//        {
//            FormattableString qrySubMenu = $"select * from VUserSubMenu where userId={userId}";
//            var subMenu = db.Database.SqlQuery<VUserSubMenu>(qrySubMenu).ToList();
//            return subMenu;
//        }

//        public List<User> GetUserList(int appId)
//        {
//            var user = db.Users.ToList();
//            var DataFound = user.Count();
//            var message = "Data Found Successfully";
//            if (DataFound == 0)
//            {
//                message = "Data not found";
//            }

//            return user;
//        }

//        public ServiceResponse<User> SaveUser(User user)
//        {
//            var checkEmployee = db.Users.Where(x => x.UserId == user.UserId);
//            if (checkEmployee.Any())
//            {
//                return new ServiceResponse<User>
//                {
//                    Message = "Error! User for the selected employee already exists",
//                    Success = false,
//                    Result = null
//                };
//            }

//            int isSuccess = 0;
//            if (user.UserId == 0)
//            {
//                db.Users.Add(user);
//                isSuccess = db.SaveChanges();
//            }
//            else if (user.UserId > 0)
//            {
//                var data = db.Users.FirstOrDefault(x => x.UserId == user.UserId);
//                if (data != null)
//                {
//                    data.UserName = user.UserName;
//                    data.PasswordHash = user.PasswordHash;
//                    data.FirstName = user.FirstName;
//                    data.LastName = user.LastName;
//                    data.IsActive = user.IsActive;
//                    data.LastUpdatedBy = user.LastUpdatedBy;
//                    data.LastUpdatedOn = DateTime.Now;
//                    isSuccess = db.SaveChanges();
//                }
//            }

//            var menu = db.Users.FirstOrDefault(x => x.UserId == user.UserId);

//            return new ServiceResponse<User>
//            {
//                Message = "Data Saved Successfully",
//                Success = isSuccess == 1,
//                Result = menu
//            };
//        }

//        public ServiceResponse<bool> ChangePassword(int userId, string oldPassword, string newPassword)
//        {
//            var data = db.Users.FirstOrDefault(x => x.UserId == userId && x.PasswordHash == oldPassword);

//            if (data == null)
//            {
//                return new ServiceResponse<bool>()
//                {
//                    Result = false,
//                    Message = "Password you supplied is not correct",
//                    Success = false
//                };
//            }

//            return new ServiceResponse<bool>()
//            {
//                Result = false,
//                Message = "Password you supplied is not correct",
//                Success = false
//            };
//        }

//        public ServiceResponse<bool> ResetPassword(int userId, string newPassword)
//        {
//            var data = db.Users.FirstOrDefault(x => x.UserId == userId && x.PasswordHash == newPassword);
//            return new ServiceResponse<bool>()
//            {
//                Result = false,
//                Message = "Password you supplied is not correct",
//                Success = false
//            }; ;
//        }
//    }
//}
