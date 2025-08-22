using Biomass.Api.Model;
using Biomass.Server.Models.UserManagement;
using Biomass.Server.Models.Company;

namespace Biomass.Server.Interfaces
{
    public interface IUserManagement
    {
        #region USER
        ServiceResponse<List<Users>> GetUsersList();
        ServiceResponse<Users> GetUserById(int userId);
        ServiceResponse<Users> SaveUser(Users user);
        ServiceResponse<Users> UpdateUser(Users user);
        ServiceResponse<bool> DeleteUserById(int userId);
        ServiceResponse<bool> DeactivateUserById(int userId);
        ServiceResponse<bool> ChangePassword(int userId, string oldPassword, string newPassword);
        ServiceResponse<bool> ResetPassword(int userId, string newPassword);
        #endregion

        #region ROLE
        ServiceResponse<List<Roles>> GetRoleList();
        ServiceResponse<Roles> GetRoleById(int roleId);
        ServiceResponse<Roles> SaveRole(Roles role);
        ServiceResponse<Roles> UpdateRole(Roles role);
        ServiceResponse<bool> DeleteRoleById(int roleId);
        #endregion

        #region MENU
        ServiceResponse<List<Menus>> GetMenuList();
        ServiceResponse<Menus> GetMenuById(int menuId);
        ServiceResponse<Menus> SaveMenu(Menus menu);
        ServiceResponse<Menus> UpdateMenu(Menus menu);
        ServiceResponse<bool> DeleteMenuById(int menuId);
        #endregion

        #region MAIN MENU
        ServiceResponse<List<MainMenus>> GetMainMenuList();
        ServiceResponse<MainMenus> GetMainMenuById(int mainMenuId);
        ServiceResponse<MainMenus> SaveMainMenu(MainMenus mainMenu);
        ServiceResponse<MainMenus> UpdateMainMenu(MainMenus mainMenu);
        ServiceResponse<bool> DeleteMainMenuById(int mainMenuId);
        #endregion

        #region SUB MENU
        ServiceResponse<List<SubMenus>> GetSubMenuList();
        ServiceResponse<List<SubMenus>> GetSubMenuListByMainMenuId(int mainMenuId);
        ServiceResponse<SubMenus> GetSubMenuById(int subMenuId);
        ServiceResponse<SubMenus> SaveSubMenu(SubMenus subMenu);
        ServiceResponse<SubMenus> UpdateSubMenu(SubMenus subMenu);
        ServiceResponse<bool> DeleteSubMenuById(int subMenuId);
        #endregion

        #region USER ROLE
        ServiceResponse<List<UserRole>> GetUserRolesByUserId(int userId);
        ServiceResponse<UserRole> AssignUserRole(UserRole userRole);
        ServiceResponse<bool> DeleteUserRoleById(int userId, int roleId);
        #endregion

        #region MENU ROLE
        ServiceResponse<List<MenuRoles>> GetMenuRolesByRoleId(int roleId);
        ServiceResponse<List<MenuRoles>> GetMenuRoleList(int? roleId = null);
        ServiceResponse<MenuRoles> AssignMenuToRole(MenuRoles menuRole);
        ServiceResponse<MenuRoles> SaveMenuRole(MenuRoles menuRole);
        ServiceResponse<bool> DeleteMenuRoleById(int roleId, int menuId);
        ServiceResponse<bool> DeleteMenuRole(int menuRoleId);
        #endregion

        #region USER COMPANIES
        ServiceResponse<List<VUserCompany>> GetUserCompaniesByUserId(int userId);
        ServiceResponse<bool> SaveUserCompany(UserCompanies userCompany);
        ServiceResponse<bool> DeleteUserCompanyById(int userId, int companyId);
        ServiceResponse<List<Company>> GetUserCompaniesNotAssignedByUserId(int userId);
        #endregion

        #region USER MENU
        ServiceResponse<UserMenuList> GetUserMenuByUserId(int userId);
        ServiceResponse<List<VUserMainMenu>> GetUserMainMenuByUserId(int userId);
        ServiceResponse<List<VUserSubMenu>> GetUserSubMenuByEmpId(int empId);
        ServiceResponse<List<UserAssignedMenus>> GetUserAssignedMenusByRoleId(int roleId);
        #endregion

        #region LOGIN LOG
        ServiceResponse<List<VLoginLog>> GetUserLoginLogsByUserId(int userId, string startDate, string endDate);
        ServiceResponse<List<VLoginLog>> GetUserLoginLogsList(string startDate, string endDate);
        ServiceResponse<List<VLoginLog>> GetUserLastLoginLogsList();
        #endregion
    }
}
