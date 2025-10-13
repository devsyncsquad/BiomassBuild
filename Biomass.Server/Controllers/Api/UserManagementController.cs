using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models;
using Biomass.Server.Models.Company;
using Biomass.Server.Models.CostCenter;
using Biomass.Server.Models.Customer;
using Biomass.Server.Models.UserManagement;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserManagementController : ControllerBase
    {
        private IUserManagement _interfaceUserManagement;
        private readonly ApplicationDbContext _context;
        private readonly IUserCostCenterService _userCostCenterService;

        public UserManagementController(IUserManagement interfaceUserManagement, ApplicationDbContext context, IUserCostCenterService userCostCenterService)
        {
            _interfaceUserManagement = interfaceUserManagement;
            _context = context;
            _userCostCenterService = userCostCenterService;
        }

        #region USER
        //[Authorize]
        //[HttpGet("GetUsersList")]

        //public ServiceResponse<List<Users>> GetUsersList()
        //{
        //    var data = _interfaceUserManagement.GetUsersList();
        //    return data;
        //}

        //[Authorize]

        [HttpGet("GetUsersList")]
        public ServiceResponse<List<UserWithCustomers>> GetUsersList()
        {
            var response = new ServiceResponse<List<UserWithCustomers>>();
            try
            {
                var users = _context.Users
                    .Include(u => u.Role) // Include role information
                    .ToList();
                var userWithCustomers = new List<UserWithCustomers>();

                foreach (var user in users)
                {
                    var customerIds = _context.UserCustomers
                        .Where(uc => uc.UserId == user.UserId && uc.Enabled)
                        .Select(uc => uc.CustomerId)
                        .ToList();

                    userWithCustomers.Add(new UserWithCustomers
                    {
                        User = user,
                        CustomerIds = customerIds
                    });
                }

                response.Result = userWithCustomers;
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

      
        [HttpGet("GetUserById")]
        public ServiceResponse<Users> GetUserById(int userId)
        {
            var data = _interfaceUserManagement.GetUserById(userId);
            return data;
        }

        //[Authorize]
        //[HttpPost("SaveUser")]
        //public ServiceResponse<Users> SaveUser(Users user)
        //{
        //    var data = _interfaceUserManagement.SaveUser(user);
        //    return data;
        //}

        //[Authorize]

        [HttpPost("SaveUser")]
        public ServiceResponse<Users> SaveUser([FromBody] SaveUserRequest request)
        {
            var response = new ServiceResponse<Users>();
            try
            {
                // Create user object
                var user = new Users
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Username = request.Username,
                    PasswordHash = request.PasswordHash,
                    EmpNo = request.EmpNo,
                    PhoneNumber = request.PhoneNumber,
                    IsTeamLead = request.IsTeamLead,
                    Enabled = request.Enabled,
                    Comments = request.Comments,
                    ReportingTo = request.ReportingTo,
                    RoleId = request.RoleId,
                    CreatedBy = request.CreatedBy // or get from current user context
                };

                // Save user
                var userResponse = _interfaceUserManagement.SaveUser(user);

                if (userResponse.Success && request.CustomerIds != null && request.CustomerIds.Any())
                {
                    // Handle customer assignments
                    foreach (var customerId in request.CustomerIds)
                    {
                        var userCustomer = new UserCustomer
                        {
                            UserId = userResponse.Result.UserId,
                            CustomerId = customerId,
                            Enabled = true,
                            CreatedOn = DateTime.UtcNow,
                            CreatedBy = request.CreatedBy
                        };

                        _context.UserCustomers.Add(userCustomer);
                    }
                    _context.SaveChanges();
                }

                response.Result = userResponse.Result;
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

        [HttpPut("UpdateUser")]
        public ServiceResponse<Users> UpdateUser([FromBody] UpdateUserRequest request)
        {
            var response = new ServiceResponse<Users>();
            try
            {
                // Update user object
                var user = new Users
                {
                    UserId = request.UserId,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Username = request.Username,
                    PasswordHash = request.PasswordHash,
                    EmpNo = request.EmpNo,
                    PhoneNumber = request.PhoneNumber,
                    IsTeamLead = request.IsTeamLead,
                    Enabled = request.Enabled,
                    Comments = request.Comments,
                    ReportingTo = request.ReportingTo,
                    RoleId = request.RoleId,
                    UpdatedBy = request.UpdatedBy
                };

                // Update user
                var userResponse = _interfaceUserManagement.UpdateUser(user);

                if (userResponse.Success && request.CustomerIds != null)
                {
                    // Remove existing customer assignments
                    var existingAssignments = _context.UserCustomers
                        .Where(uc => uc.UserId == request.UserId)
                        .ToList();
                    _context.UserCustomers.RemoveRange(existingAssignments);

                    // Add new customer assignments if any
                    if (request.CustomerIds.Any())
                    {
                        foreach (var customerId in request.CustomerIds)
                        {
                            var userCustomer = new UserCustomer
                            {
                                UserId = request.UserId,
                                CustomerId = customerId,
                                Enabled = true,
                                CreatedOn = DateTime.UtcNow,
                                CreatedBy = request.UpdatedBy
                            };
                            _context.UserCustomers.Add(userCustomer);
                        }
                    }
                    _context.SaveChanges();
                }

                response.Result = userResponse.Result;
                response.Success = true;
                response.Message = "User updated successfully with customer assignments";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        //[Authorize]
        [HttpDelete("DeleteUserById")]
        public ServiceResponse<bool> DeleteUserById(int userId)
        {
            var data = _interfaceUserManagement.DeleteUserById(userId);
            return data;
        }

        //[Authorize]
        [HttpGet("DeactivateUserById")]
        public ServiceResponse<bool> DeactivateUserById(int userId)
        {
            var data = _interfaceUserManagement.DeactivateUserById(userId);
            return data;
        }

        //[Authorize]
        [HttpGet("ChangePassword")]
        public ServiceResponse<bool> ChangePassword(int userId, string oldPassword, string newPassword)
        {
            var data = _interfaceUserManagement.ChangePassword(userId, oldPassword, newPassword);
            return data;
        }

        //[Authorize]
        [HttpGet("ResetPassword")]
        public ServiceResponse<bool> ResetPassword(int userId, string newPassword)
        {
            var data = _interfaceUserManagement.ResetPassword(userId, newPassword);
            return data;
        }
        #endregion

        #region ROLE
        //[Authorize]
        [HttpGet("GetRoleList")]
        public ServiceResponse<List<Roles>> GetRoleList()
        {
            var data = _interfaceUserManagement.GetRoleList();
            return data;
        }

        //[Authorize]
        [HttpGet("GetRoleById")]
        public ServiceResponse<Roles> GetRoleById(int roleId)
        {
            var data = _interfaceUserManagement.GetRoleById(roleId);
            return data;
        }

        //[Authorize]
        [HttpPost("SaveRole")]
        public ServiceResponse<Roles> SaveRole(Roles role)
        {
            var data = _interfaceUserManagement.SaveRole(role);
            return data;
        }

        //[Authorize]
        [HttpPut("UpdateRole")]
        public ServiceResponse<Roles> UpdateRole(Roles role)
        {
            var data = _interfaceUserManagement.UpdateRole(role);
            return data;
        }

        //[Authorize]
        [HttpDelete("DeleteRoleById")]
        public ServiceResponse<bool> DeleteRoleById(int roleId)
        {
            var data = _interfaceUserManagement.DeleteRoleById(roleId);
            return data;
        }
        #endregion

        #region MENU
        //[Authorize]
        [HttpGet("GetMenuList")]
        public ServiceResponse<List<Menus>> GetMenuList()
        {
            var data = _interfaceUserManagement.GetMenuList();
            return data;
        }

        //[Authorize]
        [HttpGet("GetMenuById")]
        public ServiceResponse<Menus> GetMenuById(int menuId)
        {
            var data = _interfaceUserManagement.GetMenuById(menuId);
            return data;
        }

        //[Authorize]
        [HttpPost("SaveMenu")]
        public ServiceResponse<Menus> SaveMenu(Menus menu)
        {
            var data = _interfaceUserManagement.SaveMenu(menu);
            return data;
        }

        //[Authorize]
        [HttpPut("UpdateMenu")]
        public ServiceResponse<Menus> UpdateMenu(Menus menu)
        {
            var data = _interfaceUserManagement.UpdateMenu(menu);
            return data;
        }

        //[Authorize]
        [HttpDelete("DeleteMenuById")]
        public ServiceResponse<bool> DeleteMenuById(int menuId)
        {
            var data = _interfaceUserManagement.DeleteMenuById(menuId);
            return data;
        }
        #endregion

        #region MAIN MENU
        //[Authorize]
        [HttpGet("GetMainMenuList")]
        public ServiceResponse<List<MainMenus>> GetMainMenuList()
        {
            var data = _interfaceUserManagement.GetMainMenuList();
            return data;
        }

        //[Authorize]
        [HttpGet("GetMainMenuById")]
        public ServiceResponse<MainMenus> GetMainMenuById(int mainMenuId)
        {
            var data = _interfaceUserManagement.GetMainMenuById(mainMenuId);
            return data;
        }

        //[Authorize]
        [HttpPost("SaveMainMenu")]
        public ServiceResponse<MainMenus> SaveMainMenu(MainMenus mainMenu)
        {
            var data = _interfaceUserManagement.SaveMainMenu(mainMenu);
            return data;
        }

        //[Authorize]
        [HttpPut("UpdateMainMenu")]
        public ServiceResponse<MainMenus> UpdateMainMenu(MainMenus mainMenu)
        {
            var data = _interfaceUserManagement.UpdateMainMenu(mainMenu);
            return data;
        }

        //[Authorize]
        [HttpDelete("DeleteMainMenuById")]
        public ServiceResponse<bool> DeleteMainMenuById(int mainMenuId)
        {
            var data = _interfaceUserManagement.DeleteMainMenuById(mainMenuId);
            return data;
        }
        #endregion

        #region SUB MENU
        //[Authorize]
        [HttpGet("GetSubMenuList")]
        public ServiceResponse<List<SubMenus>> GetSubMenuList()
        {
            var data = _interfaceUserManagement.GetSubMenuList();
            return data;
        }

        //[Authorize]
        [HttpGet("GetSubMenuListByMainMenuId")]
        public ServiceResponse<List<SubMenus>> GetSubMenuListByMainMenuId(int mainMenuId)
        {
            var data = _interfaceUserManagement.GetSubMenuListByMainMenuId(mainMenuId);
            return data;
        }

        //[Authorize]
        [HttpGet("GetSubMenuById")]
        public ServiceResponse<SubMenus> GetSubMenuById(int subMenuId)
        {
            var data = _interfaceUserManagement.GetSubMenuById(subMenuId);
            return data;
        }

        //[Authorize]
        [HttpPost("SaveSubMenu")]
        public ServiceResponse<SubMenus> SaveSubMenu(SubMenus subMenu)
        {
            var data = _interfaceUserManagement.SaveSubMenu(subMenu);
            return data;
        }

        //[Authorize]
        [HttpPut("UpdateSubMenu")]
        public ServiceResponse<SubMenus> UpdateSubMenu(SubMenus subMenu)
        {
            var data = _interfaceUserManagement.UpdateSubMenu(subMenu);
            return data;
        }

        //[Authorize]
        [HttpDelete("DeleteSubMenuById")]
        public ServiceResponse<bool> DeleteSubMenuById(int subMenuId)
        {
            var data = _interfaceUserManagement.DeleteSubMenuById(subMenuId);
            return data;
        }
        #endregion

        #region USER ROLE
        //[Authorize]
        [HttpGet("GetUserRolesByUserId")]
        public ServiceResponse<List<UserRole>> GetUserRolesByUserId(int userId)
        {
            var data = _interfaceUserManagement.GetUserRolesByUserId(userId);
            return data;
        }

        //[Authorize]
        [HttpPost("AssignUserRole")]
        public ServiceResponse<UserRole> AssignUserRole(UserRole userRole)
        {
            var data = _interfaceUserManagement.AssignUserRole(userRole);
            return data;
        }

        //[Authorize]
        [HttpDelete("DeleteUserRoleById")]
        public ServiceResponse<bool> DeleteUserRoleById(int userId, int roleId)
        {
            var data = _interfaceUserManagement.DeleteUserRoleById(userId, roleId);
            return data;
        }
        #endregion

        #region MENU ROLE
        //[Authorize]
        [HttpGet("GetMenuRolesByRoleId")]
        public ServiceResponse<List<MenuRoles>> GetMenuRolesByRoleId(int roleId)
        {
            var data = _interfaceUserManagement.GetMenuRolesByRoleId(roleId);
            return data;
        }

        //[Authorize]
        [HttpGet("GetMenuRoleList")]
        public ServiceResponse<List<MenuRoles>> GetMenuRoleList(int? roleId = null)
        {
            var data = _interfaceUserManagement.GetMenuRoleList(roleId);
            return data;
        }

        //[Authorize]
        [HttpPost("AssignMenuToRole")]
        public ServiceResponse<MenuRoles> AssignMenuToRole(MenuRoles menuRole)
        {
            var data = _interfaceUserManagement.AssignMenuToRole(menuRole);
            return data;
        }

        //[Authorize]
        [HttpPost("SaveMenuRole")]
        public ServiceResponse<MenuRoles> SaveMenuRole(MenuRoles menuRole)
        {
            var data = _interfaceUserManagement.SaveMenuRole(menuRole);
            return data;
        }

        //[Authorize]
        [HttpDelete("DeleteMenuRoleById")]
        public ServiceResponse<bool> DeleteMenuRoleById(int roleId, int menuId)
        {
            var data = _interfaceUserManagement.DeleteMenuRoleById(roleId, menuId);
            return data;
        }

        //[Authorize]
        [HttpDelete("DeleteMenuRole/{menuRoleId}")]
        public ServiceResponse<bool> DeleteMenuRole(int menuRoleId)
        {
            var data = _interfaceUserManagement.DeleteMenuRole(menuRoleId);
            return data;
        }
        #endregion

        #region USER COMPANIES
        //[Authorize]
        [HttpGet("GetUserCompaniesByUserId")]
        public ServiceResponse<List<VUserCompany>> GetUserCompaniesByUserId(int userId)
        {
            var data = _interfaceUserManagement.GetUserCompaniesByUserId(userId);
            return data;
        }

        //[Authorize]
        [HttpPost("SaveUserCompany")]
        public ServiceResponse<bool> SaveUserCompany(UserCompanies userCompany)
        {
            var data = _interfaceUserManagement.SaveUserCompany(userCompany);
            return data;
        }

        //[Authorize]
        [HttpDelete("DeleteUserCompanyById")]
        public ServiceResponse<bool> DeleteUserCompanyById(int userId, int companyId)
        {
            var data = _interfaceUserManagement.DeleteUserCompanyById(userId, companyId);
            return data;
        }

        //[Authorize]
        [HttpGet("GetUserCompaniesNotAssignedByUserId")]
        public ServiceResponse<List<Company>> GetUserCompaniesNotAssignedByUserId(int userId)
        {
            var data = _interfaceUserManagement.GetUserCompaniesNotAssignedByUserId(userId);
            return data;
        }
        #endregion

        #region USER MENU
        //[Authorize]
        [HttpGet("GetUserMenuByUserId")]
        public ServiceResponse<UserMenuList> GetUserMenuByUserId(int userId)
        {
            var data = _interfaceUserManagement.GetUserMenuByUserId(userId);
            return data;
        }

        //[Authorize]
        [HttpGet("GetUserMainMenuByUserId")]
        public ServiceResponse<List<VUserMainMenu>> GetUserMainMenuByUserId(int userId)
        {
            var data = _interfaceUserManagement.GetUserMainMenuByUserId(userId);
            return data;
        }

        //[Authorize]
        [HttpGet("GetUserSubMenuByEmpId")]
        public ServiceResponse<List<VUserSubMenu>> GetUserSubMenuByEmpId(int empId)
        {
            var data = _interfaceUserManagement.GetUserSubMenuByEmpId(empId);
            return data;
        }

        //[Authorize]
        [HttpGet("GetUserAssignedMenusByRoleId")]
        public ServiceResponse<List<UserAssignedMenus>> GetUserAssignedMenusByRoleId(int roleId)
        {
            var data = _interfaceUserManagement.GetUserAssignedMenusByRoleId(roleId);
            return data;
        }
        #endregion

        #region LOGIN LOG
        //[Authorize]
        [HttpGet("GetUserLoginLogsByUserId")]
        public ServiceResponse<List<VLoginLog>> GetUserLoginLogsByUserId(int userId, string startDate, string endDate)
        {
            var data = _interfaceUserManagement.GetUserLoginLogsByUserId(userId, startDate, endDate);
            return data;
        }

        //[Authorize]
        [HttpGet("GetUserLoginLogsList")]
        public ServiceResponse<List<VLoginLog>> GetUserLoginLogsList(string startDate, string endDate)
        {
            var data = _interfaceUserManagement.GetUserLoginLogsList(startDate, endDate);
            return data;
        }

        //[Authorize]
        [HttpGet("GetUserLastLoginLogsList")]
        public ServiceResponse<List<VLoginLog>> GetUserLastLoginLogsList()
        {
            var data = _interfaceUserManagement.GetUserLastLoginLogsList();
            return data;
        }
        #endregion

        #region USER COST CENTER ASSIGNMENT

        [HttpGet("GetUserCostCenterAssignment/{userId}")]
        public async Task<ActionResult<ServiceResponse<Models.UserManagement.UserCostCenterAssignmentDto>>> GetUserCostCenterAssignment(int userId)
        {
            try
            {
                var assignment = await _userCostCenterService.GetUserCostCenterAssignmentAsync(userId);
                return Ok(new ServiceResponse<Models.UserManagement.UserCostCenterAssignmentDto>
                {
                    Result = assignment,
                    Message = "User cost center assignment retrieved successfully",
                    Success = true
                });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new ServiceResponse<Models.UserManagement.UserCostCenterAssignmentDto>
                {
                    Message = ex.Message,
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ServiceResponse<Models.UserManagement.UserCostCenterAssignmentDto>
                {
                    Message = $"Error retrieving user cost center assignment: {ex.Message}",
                    Success = false
                });
            }
        }

        [HttpPost("AssignCostCenterToUser")]
        public async Task<ActionResult<ServiceResponse<UserCostCenterDto>>> AssignCostCenterToUser([FromBody] Biomass.Server.Models.UserManagement.AssignCostCenterRequest request)
        {
            try
            {
                var assignment = await _userCostCenterService.AssignCostCenterToUserAsync(request);
                return Ok(new ServiceResponse<UserCostCenterDto>
                {
                    Result = assignment,
                    Message = "Cost center assigned to user successfully",
                    Success = true
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ServiceResponse<UserCostCenterDto>
                {
                    Message = ex.Message,
                    Success = false
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ServiceResponse<UserCostCenterDto>
                {
                    Message = ex.Message,
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ServiceResponse<UserCostCenterDto>
                {
                    Message = $"Error assigning cost center to user: {ex.Message}",
                    Success = false
                });
            }
        }

        [HttpDelete("UnassignCostCenterFromUser/{userId}/{costCenterId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UnassignCostCenterFromUser(int userId, int costCenterId)
        {
            try
            {
                var result = await _userCostCenterService.UnassignCostCenterFromUserAsync(userId, costCenterId);
                if (result)
                {
                    return Ok(new ServiceResponse<bool>
                    {
                        Result = true,
                        Message = "Cost center unassigned from user successfully",
                        Success = true
                    });
                }
                else
                {
                    return NotFound(new ServiceResponse<bool>
                    {
                        Message = "Cost center assignment not found",
                        Success = false
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ServiceResponse<bool>
                {
                    Message = $"Error unassigning cost center from user: {ex.Message}",
                    Success = false
                });
            }
        }

        [HttpGet("GetUserCostCenters/{userId}")]
        public async Task<ActionResult<ServiceResponse<List<UserCostCenterDto>>>> GetUserCostCenters(int userId)
        {
            try
            {
                var userCostCenters = await _userCostCenterService.GetUserCostCentersAsync(userId);
                return Ok(new ServiceResponse<List<UserCostCenterDto>>
                {
                    Result = userCostCenters,
                    Message = "User cost centers retrieved successfully",
                    Success = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ServiceResponse<List<UserCostCenterDto>>
                {
                    Message = $"Error retrieving user cost centers: {ex.Message}",
                    Success = false
                });
            }
        }

        #endregion
    }
} 