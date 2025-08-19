using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Company;
using Biomass.Server.Models.Customer;
using Biomass.Server.Models.UserManagement;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Biomass.Server.Repository
{
    public class UserManagmentRepository : IUserManagement
    {
        private readonly ApplicationDbContext _context;
        //private readonly IUserManagement _userManagementRepository;

        public UserManagmentRepository(ApplicationDbContext context)
        {
            _context = context;
            //_userManagementRepository = userManagementRepository;
        }

        #region USER
        public ServiceResponse<List<Users>> GetUsersList()
        {
            var response = new ServiceResponse<List<Users>>();
            try
            {
                var users = _context.Users.ToList();
                response.Result = users;
                response.Success = true;
                response.Message = "Users retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<Users> GetUserById(int userId)
        {
            var response = new ServiceResponse<Users>();
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
                if (user != null)
                {
                    response.Result = user;
                    response.Success = true;
                    response.Message = "User retrieved successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        //public ServiceResponse<Users> SaveUser(Users user)
        //{
        //    var response = new ServiceResponse<Users>();
        //    try
        //    {
        //        //user.CreatedAt = DateTime.Now;
        //        //user.UpdatedAt = DateTime.Now;
        //        user.CreatedAt = DateTime.UtcNow;
        //        user.UpdatedAt = DateTime.UtcNow;


        //        if (!string.IsNullOrEmpty(user.PasswordHash))
        //        {
        //            user.PasswordHash = HashPassword(user.PasswordHash);
        //        }

        //        _context.Users.Add(user);
        //        _context.SaveChanges();

        //        response.Result = user;
        //        response.Success = true;
        //        response.Message = "User saved successfully";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = ex.Message;
        //    }
        //    return response;
        //}

        public ServiceResponse<Users> SaveUser(Users user)
        {
            var response = new ServiceResponse<Users>();
            try
            {
                // Set timestamps
                user.CreatedAt = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;

                // Hash password if provided
                //if (!string.IsNullOrEmpty(user.PasswordHash))
                //{
                //    user.PasswordHash = HashPassword(user.PasswordHash);
                //}

                // Save user first
                _context.Users.Add(user);
                _context.SaveChanges();

                // Handle customer assignments if provided
                if (user.CustomerIds != null && user.CustomerIds.Any())
                {
                    foreach (var customerId in user.CustomerIds)
                    {
                        var userCustomer = new UserCustomer
                        {
                            UserId = user.UserId,
                            CustomerId = customerId,
                            Enabled = true,
                            CreatedOn = DateTime.UtcNow,
                            CreatedBy = user.CreatedBy // or get from current user context
                        };

                        _context.UserCustomers.Add(userCustomer);
                    }
                    _context.SaveChanges();
                }

                response.Result = user;
                response.Success = true;
                response.Message = "User saved successfully with customer assignments";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<Users> UpdateUser(Users user)
        {
            var response = new ServiceResponse<Users>();
            try
            {
                var existingUser = _context.Users.FirstOrDefault(u => u.UserId == user.UserId);
                if (existingUser != null)
                {
                    existingUser.FirstName = user.FirstName;
                    existingUser.LastName = user.LastName;
                    existingUser.Username = user.Username;
                    existingUser.EmpNo = user.EmpNo;
                    existingUser.RoleId = user.RoleId;
                    existingUser.PhoneNumber = user.PhoneNumber;
                    existingUser.IsTeamLead = user.IsTeamLead;
                    existingUser.Enabled = user.Enabled;
                    existingUser.Comments = user.Comments;
                    existingUser.ReportingTo = user.ReportingTo;
                    existingUser.UpdatedBy = user.UpdatedBy;
                    existingUser.UpdatedAt = DateTime.UtcNow;
                    existingUser.PasswordHash = user.PasswordHash;

                    //if (!string.IsNullOrEmpty(user.PasswordHash))
                    //{
                    //    existingUser.PasswordHash = HashPassword(user.PasswordHash);
                    //}

                    _context.SaveChanges();

                    response.Result = existingUser;
                    response.Success = true;
                    response.Message = "User updated successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> DeleteUserById(int userId)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
                if (user != null)
                {
                    _context.Users.Remove(user);
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "User deleted successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> DeactivateUserById(int userId)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
                if (user != null)
                {
                    user.Enabled = "N";
                    user.UpdatedAt = DateTime.Now;
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "User deactivated successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> ChangePassword(int userId, string oldPassword, string newPassword)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
                if (user != null)
                {
                    var hashedOldPassword = HashPassword(oldPassword);
                    if (user.PasswordHash == hashedOldPassword)
                    {
                        user.PasswordHash = HashPassword(newPassword);
                        user.UpdatedAt = DateTime.Now;
                        _context.SaveChanges();

                        response.Result = true;
                        response.Success = true;
                        response.Message = "Password changed successfully";
                    }
                    else
                    {
                        response.Success = false;
                        response.Message = "Old password is incorrect";
                    }
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> ResetPassword(int userId, string newPassword)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
                if (user != null)
                {
                    user.PasswordHash = HashPassword(newPassword);
                    user.UpdatedAt = DateTime.Now;
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "Password reset successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "User not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        #endregion

        #region ROLE
        public ServiceResponse<List<Roles>> GetRoleList()
        {
            var response = new ServiceResponse<List<Roles>>();
            try
            {
                var roles = _context.Roles.ToList();
                response.Result = roles;
                response.Success = true;
                response.Message = "Roles retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<Roles> GetRoleById(int roleId)
        {
            var response = new ServiceResponse<Roles>();
            try
            {
                var role = _context.Roles.FirstOrDefault(r => r.RoleId == roleId);
                if (role != null)
                {
                    response.Result = role;
                    response.Success = true;
                    response.Message = "Role retrieved successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Role not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<Roles> SaveRole(Roles role)
        {
            var response = new ServiceResponse<Roles>();
            try
            {
                role.CreatedAt = DateTime.UtcNow;
                role.UpdatedAt = DateTime.UtcNow;

                _context.Roles.Add(role);
                _context.SaveChanges();

                response.Result = role;
                response.Success = true;
                response.Message = "Role saved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<Roles> UpdateRole(Roles role)
        {
            var response = new ServiceResponse<Roles>();
            try
            {
                var existingRole = _context.Roles.FirstOrDefault(r => r.RoleId == role.RoleId);
                if (existingRole != null)
                {
                    existingRole.RoleName = role.RoleName;
                    existingRole.Enabled = role.Enabled;
                    existingRole.Description = role.Description;
                    existingRole.UpdatedBy = role.UpdatedBy;
                    existingRole.UpdatedAt = DateTime.UtcNow;

                    _context.SaveChanges();

                    response.Result = existingRole;
                    response.Success = true;
                    response.Message = "Role updated successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Role not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> DeleteRoleById(int roleId)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var role = _context.Roles.FirstOrDefault(r => r.RoleId == roleId);
                if (role != null)
                {
                    _context.Roles.Remove(role);
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "Role deleted successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Role not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        #endregion

        #region MENU
        public ServiceResponse<List<Menus>> GetMenuList()
        {
            var response = new ServiceResponse<List<Menus>>();
            try
            {
                var menus = _context.Menus.ToList();
                response.Result = menus;
                response.Success = true;
                response.Message = "Menus retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<Menus> GetMenuById(int menuId)
        {
            var response = new ServiceResponse<Menus>();
            try
            {
                var menu = _context.Menus.FirstOrDefault(m => m.MenuId == menuId);
                if (menu != null)
                {
                    response.Result = menu;
                    response.Success = true;
                    response.Message = "Menu retrieved successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Menu not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<Menus> SaveMenu(Menus menu)
        {
            var response = new ServiceResponse<Menus>();
            try
            {
                menu.CreatedAt = DateTime.UtcNow;
                menu.UpdatedAt = DateTime.UtcNow;

                _context.Menus.Add(menu);
                _context.SaveChanges();

                response.Result = menu;
                response.Success = true;
                response.Message = "Menu saved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<Menus> UpdateMenu(Menus menu)
        {
            var response = new ServiceResponse<Menus>();
            try
            {
                var existingMenu = _context.Menus.FirstOrDefault(m => m.MenuId == menu.MenuId);
                if (existingMenu != null)
                {
                    existingMenu.MenuName = menu.MenuName;
                    existingMenu.IconUrl = menu.IconUrl;
                    existingMenu.OrderNo = menu.OrderNo;
                    existingMenu.IsEnabled = menu.IsEnabled;
                    existingMenu.Link = menu.Link;
                    existingMenu.UpdatedBy = menu.UpdatedBy;
                    existingMenu.UpdatedAt = DateTime.UtcNow;

                    _context.SaveChanges();

                    response.Result = existingMenu;
                    response.Success = true;
                    response.Message = "Menu updated successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Menu not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> DeleteMenuById(int menuId)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var menu = _context.Menus.FirstOrDefault(m => m.MenuId == menuId);
                if (menu != null)
                {
                    _context.Menus.Remove(menu);
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "Menu deleted successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Menu not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        #endregion

        #region USER ROLE
        public ServiceResponse<List<UserRole>> GetUserRolesByUserId(int userId)
        {
            var response = new ServiceResponse<List<UserRole>>();
            try
            {
                var userRoles = _context.UserRoles.Where(ur => ur.UserId == userId).ToList();
                response.Result = userRoles;
                response.Success = true;
                response.Message = "User roles retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<UserRole> AssignUserRole(UserRole userRole)
        {
            var response = new ServiceResponse<UserRole>();
            try
            {
                userRole.CreatedOn = DateTime.Now;
                userRole.UpdatedOn = DateTime.Now;

                _context.UserRoles.Add(userRole);
                _context.SaveChanges();

                response.Result = userRole;
                response.Success = true;
                response.Message = "User role assigned successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> DeleteUserRoleById(int userId, int roleId)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var userRole = _context.UserRoles.FirstOrDefault(ur => ur.UserId == userId && ur.RoleId == roleId);
                if (userRole != null)
                {
                    _context.UserRoles.Remove(userRole);
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "User role deleted successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "User role not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        #endregion

        #region MAIN MENU
        public ServiceResponse<List<MainMenus>> GetMainMenuList()
        {
            var response = new ServiceResponse<List<MainMenus>>();
            try
            {
                var mainMenus = _context.MainMenus.ToList();
                response.Result = mainMenus;
                response.Success = true;
                response.Message = "Main menus retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<MainMenus> GetMainMenuById(int mainMenuId)
        {
            var response = new ServiceResponse<MainMenus>();
            try
            {
                var mainMenu = _context.MainMenus.FirstOrDefault(mm => mm.MainMenuId == mainMenuId);
                if (mainMenu != null)
                {
                    response.Result = mainMenu;
                    response.Success = true;
                    response.Message = "Main menu retrieved successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Main menu not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<MainMenus> SaveMainMenu(MainMenus mainMenu)
        {
            var response = new ServiceResponse<MainMenus>();
            try
            {
                mainMenu.CreatedOn = DateTime.UtcNow;
                mainMenu.LastUpdatedOn = DateTime.UtcNow;

                _context.MainMenus.Add(mainMenu);
                _context.SaveChanges();

                response.Result = mainMenu;
                response.Success = true;
                response.Message = "Main menu saved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<MainMenus> UpdateMainMenu(MainMenus mainMenu)
        {
            var response = new ServiceResponse<MainMenus>();
            try
            {
                var existingMainMenu = _context.MainMenus.FirstOrDefault(mm => mm.MainMenuId == mainMenu.MainMenuId);
                if (existingMainMenu != null)
                {
                    existingMainMenu.MainMenuDesc = mainMenu.MainMenuDesc;
                    existingMainMenu.OrderNo = mainMenu.OrderNo;
                    existingMainMenu.Enabled = mainMenu.Enabled;
                    existingMainMenu.Icon = mainMenu.Icon;
                    existingMainMenu.LastUpdatedBy = mainMenu.LastUpdatedBy;
                    existingMainMenu.LastUpdatedOn = DateTime.UtcNow;

                    _context.SaveChanges();

                    response.Result = existingMainMenu;
                    response.Success = true;
                    response.Message = "Main menu updated successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Main menu not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> DeleteMainMenuById(int mainMenuId)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var mainMenu = _context.MainMenus.FirstOrDefault(mm => mm.MainMenuId == mainMenuId);
                if (mainMenu != null)
                {
                    _context.MainMenus.Remove(mainMenu);
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "Main menu deleted successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Main menu not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        #endregion

        #region SUB MENU
        public ServiceResponse<List<SubMenus>> GetSubMenuList()
        {
            var response = new ServiceResponse<List<SubMenus>>();
            try
            {
                var subMenus = _context.SubMenus.ToList();
                response.Result = subMenus;
                response.Success = true;
                response.Message = "Sub menus retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<List<SubMenus>> GetSubMenuListByMainMenuId(int mainMenuId)
        {
            var response = new ServiceResponse<List<SubMenus>>();
            try
            {
                var subMenus = _context.SubMenus.Where(sm => sm.MainMenuId == mainMenuId).ToList();
                response.Result = subMenus;
                response.Success = true;
                response.Message = "Sub menus retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<SubMenus> GetSubMenuById(int subMenuId)
        {
            var response = new ServiceResponse<SubMenus>();
            try
            {
                var subMenu = _context.SubMenus.FirstOrDefault(sm => sm.SubMenuId == subMenuId);
                if (subMenu != null)
                {
                    response.Result = subMenu;
                    response.Success = true;
                    response.Message = "Sub menu retrieved successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Sub menu not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<SubMenus> SaveSubMenu(SubMenus subMenu)
        {
            var response = new ServiceResponse<SubMenus>();
            try
            {
                subMenu.CreatedOn = DateTime.UtcNow;
                subMenu.LastUpdatedOn = DateTime.UtcNow;

                _context.SubMenus.Add(subMenu);
                _context.SaveChanges();

                response.Result = subMenu;
                response.Success = true;
                response.Message = "Sub menu saved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<SubMenus> UpdateSubMenu(SubMenus subMenu)
        {
            var response = new ServiceResponse<SubMenus>();
            try
            {
                var existingSubMenu = _context.SubMenus.FirstOrDefault(sm => sm.SubMenuId == subMenu.SubMenuId);
                if (existingSubMenu != null)
                {
                    existingSubMenu.SubMenuDesc = subMenu.SubMenuDesc;
                    existingSubMenu.Link = subMenu.Link;
                    existingSubMenu.Icon = subMenu.Icon;
                    existingSubMenu.MainMenuId = subMenu.MainMenuId;
                    existingSubMenu.OrderNo = subMenu.OrderNo;
                    existingSubMenu.Enabled = subMenu.Enabled;
                    existingSubMenu.AppId = subMenu.AppId;
                    existingSubMenu.LastUpdatedBy = subMenu.LastUpdatedBy;
                    existingSubMenu.LastUpdatedOn = DateTime.UtcNow;

                    _context.SaveChanges();

                    response.Result = existingSubMenu;
                    response.Success = true;
                    response.Message = "Sub menu updated successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Sub menu not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> DeleteSubMenuById(int subMenuId)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var subMenu = _context.SubMenus.FirstOrDefault(sm => sm.SubMenuId == subMenuId);
                if (subMenu != null)
                {
                    _context.SubMenus.Remove(subMenu);
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "Sub menu deleted successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Sub menu not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        #endregion

        #region MENU ROLE
        public ServiceResponse<List<MenuRoles>> GetMenuRolesByRoleId(int roleId)
        {
            var response = new ServiceResponse<List<MenuRoles>>();
            try
            {
                var menuRoles = _context.MenuRoles.Where(mr => mr.RoleId == roleId).ToList();
                response.Result = menuRoles;
                response.Success = true;
                response.Message = "Menu roles retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<List<MenuRoles>> GetMenuRoleList(int? roleId = null)
        {
            var response = new ServiceResponse<List<MenuRoles>>();
            try
            {
                var query = _context.MenuRoles.AsQueryable();
                
                if (roleId.HasValue)
                {
                    query = query.Where(mr => mr.RoleId == roleId.Value);
                }
                
                var menuRoles = query.ToList();
                response.Result = menuRoles;
                response.Success = true;
                response.Message = "Menu roles retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<MenuRoles> AssignMenuToRole(MenuRoles menuRole)
        {
            var response = new ServiceResponse<MenuRoles>();
            try
            {
                _context.MenuRoles.Add(menuRole);
                _context.SaveChanges();

                response.Result = menuRole;
                response.Success = true;
                response.Message = "Menu assigned to role successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<MenuRoles> SaveMenuRole(MenuRoles menuRole)
        {
            var response = new ServiceResponse<MenuRoles>();
            try
            {
                // Check if menu role already exists
                var existingMenuRole = _context.MenuRoles.FirstOrDefault(mr => mr.RoleId == menuRole.RoleId && mr.MenuId == menuRole.MenuId);
                
                if (existingMenuRole != null)
                {
                    response.Result = existingMenuRole;
                    response.Success = true;
                    response.Message = "Menu role already exists";
                }
                else
                {
                    _context.MenuRoles.Add(menuRole);
                    _context.SaveChanges();

                    response.Result = menuRole;
                    response.Success = true;
                    response.Message = "Menu role saved successfully";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> DeleteMenuRoleById(int roleId, int menuId)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var menuRole = _context.MenuRoles.FirstOrDefault(mr => mr.RoleId == roleId && mr.MenuId == menuId);
                if (menuRole != null)
                {
                    _context.MenuRoles.Remove(menuRole);
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "Menu role deleted successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Menu role not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<bool> DeleteMenuRole(int menuRoleId)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var menuRole = _context.MenuRoles.FirstOrDefault(mr => mr.MenuRoleId == menuRoleId);
                if (menuRole != null)
                {
                    _context.MenuRoles.Remove(menuRole);
                    _context.SaveChanges();

                    response.Result = true;
                    response.Success = true;
                    response.Message = "Menu role deleted successfully";
                }
                else
                {
                    response.Success = false;
                    response.Message = "Menu role not found";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        #endregion

        #region USER COMPANIES
        public ServiceResponse<List<VUserCompany>> GetUserCompaniesByUserId(int userId)
        {
            var response = new ServiceResponse<List<VUserCompany>>();
            try
            {
                var userCompanies = _context.Companies.Where(uc => uc.CompanyId == userId).ToList();
                //response.Result = userCompanies;
                response.Success = true;
                response.Message = "User companies retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        //public ServiceResponse<bool> SaveUserCompany(UserCompanies userCompany)
        //{
        //    var response = new ServiceResponse<bool>();
        //    try
        //    {
        //        _context.UserCompanies.Add(userCompany);
        //        _context.SaveChanges();

        //        response.Result = true;
        //        response.Success = true;
        //        response.Message = "User company saved successfully";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = ex.Message;
        //    }
        //    return response;
        //}

        //public ServiceResponse<bool> DeleteUserCompanyById(int userId, int companyId)
        //{
        //    var response = new ServiceResponse<bool>();
        //    try
        //    {
        //        var userCompany = _context.UserCompanies.FirstOrDefault(uc => uc.UserId == userId && uc.CompanyId == companyId);
        //        if (userCompany != null)
        //        {
        //            _context.UserCompanies.Remove(userCompany);
        //            _context.SaveChanges();

        //            response.Result = true;
        //            response.Success = true;
        //            response.Message = "User company deleted successfully";
        //        }
        //        else
        //        {
        //            response.Success = false;
        //            response.Message = "User company not found";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = ex.Message;
        //    }
        //    return response;
        //}

        //public ServiceResponse<List<Company>> GetUserCompaniesNotAssignedByUserId(int userId)
        //{
        //    var response = new ServiceResponse<List<Company>>();
        //    try
        //    {
        //        var assignedCompanyIds = _context.UserCompanies
        //            .Where(uc => uc.UserId == userId)
        //            .Select(uc => uc.CompanyId)
        //            .ToList();

        //        var unassignedCompanies = _context.Companies
        //            .Where(c => !assignedCompanyIds.Contains(c.CompanyId))
        //            .ToList();

        //        response.Result = unassignedCompanies;
        //        response.Success = true;
        //        response.Message = "Unassigned companies retrieved successfully";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = ex.Message;
        //    }
        //    return response;
        //}
        #endregion

        #region USER MENU
        public ServiceResponse<UserMenuList> GetUserMenuByUserId(int userId)
        {
            var response = new ServiceResponse<UserMenuList>();
            try
            {
                // This would need to be implemented based on your UserMenuList model
                response.Success = false;
                response.Message = "Method not implemented";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<List<VUserMainMenu>> GetUserMainMenuByUserId(int userId)
        {
            var response = new ServiceResponse<List<VUserMainMenu>>();
            try
            {
                var userMainMenus = _context.Menus.Where(umm => umm.MenuId == userId).ToList();
                //response.Result = userMainMenus;
                response.Success = true;
                response.Message = "User main menus retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<List<VUserSubMenu>> GetUserSubMenuByEmpId(int empId)
        {
            var response = new ServiceResponse<List<VUserSubMenu>>();
            try
            {
                var userSubMenus = _context.Menus.Where(usm => usm.MenuId == empId).ToList();
                //response.Result = userSubMenus;
                response.Success = true;
                response.Message = "User sub menus retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        #endregion

        #region LOGIN LOG
        //public ServiceResponse<List<VLoginLog>> GetUserLoginLogsByUserId(int userId, string startDate, string endDate)
        //{
        //    var response = new ServiceResponse<List<VLoginLog>>();
        //    try
        //    {
        //        var loginLogs = _context.VLoginLogs.Where(ll => ll.UserId == userId).ToList();
        //        response.Result = loginLogs;
        //        response.Success = true;
        //        response.Message = "Login logs retrieved successfully";
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = ex.Message;
        //    }
        //    return response;
        //}

        public ServiceResponse<List<VLoginLog>> GetUserLoginLogsList(string startDate, string endDate)
        {
            var response = new ServiceResponse<List<VLoginLog>>();
            try
            {
                var loginLogs = _context.Users.ToList();
                //response.Result = loginLogs;
                response.Success = true;
                response.Message = "Login logs retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public ServiceResponse<List<VLoginLog>> GetUserLastLoginLogsList()
        {
            var response = new ServiceResponse<List<VLoginLog>>();
            try
            {
                var loginLogs = _context.Users.ToList();
                //response.Result = loginLogs;
                response.Success = true;
                response.Message = "Last login logs retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }
        #endregion

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        public ServiceResponse<bool> SaveUserCompany(UserCompanies userCompany)
        {
            throw new NotImplementedException();
        }

        public ServiceResponse<bool> DeleteUserCompanyById(int userId, int companyId)
        {
            throw new NotImplementedException();
        }

        public ServiceResponse<List<Company>> GetUserCompaniesNotAssignedByUserId(int userId)
        {
            throw new NotImplementedException();
        }

        public ServiceResponse<List<VLoginLog>> GetUserLoginLogsByUserId(int userId, string startDate, string endDate)
        {
            throw new NotImplementedException();
        }
    }
}