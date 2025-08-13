// API Configuration and Utility Functions

// Get the base URL from environment variable with fallback
export const getBaseUrl = () => {
  return import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';
};

// Common headers for API requests
export const getHeaders = () => {
  return {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: getHeaders(),
    ...options
  };

  console.log('API Request:', url, defaultOptions); // Debug log

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

// User Management API functions
export const userManagementApi = {
  // Users
  getUsers: () => apiRequest('/api/UserManagement/GetUsersList'),
  getUserById: (userId) => apiRequest(`/api/UserManagement/GetUserById?userId=${userId}`),
  saveUser: (userData) => apiRequest('/api/UserManagement/SaveUser', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  updateUser: (userData) => apiRequest('/api/UserManagement/UpdateUser', {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  deleteUser: (userId) => apiRequest(`/api/UserManagement/DeleteUserById?userId=${userId}`, {
    method: 'DELETE'
  }),
  deactivateUser: (userId) => apiRequest(`/api/UserManagement/DeactivateUserById?userId=${userId}`),

  // Roles
  getRoles: () => apiRequest('/api/UserManagement/GetRoleList'),
  getRoleById: (roleId) => apiRequest(`/api/UserManagement/GetRoleById?roleId=${roleId}`),
  saveRole: (roleData) => apiRequest('/api/UserManagement/SaveRole', {
    method: 'POST',
    body: JSON.stringify(roleData)
  }),
  updateRole: (roleData) => apiRequest('/api/UserManagement/UpdateRole', {
    method: 'PUT',
    body: JSON.stringify(roleData)
  }),
  deleteRole: (roleId) => apiRequest(`/api/UserManagement/DeleteRoleById?roleId=${roleId}`, {
    method: 'DELETE'
  }),

  // Menus
  getMenus: () => apiRequest('/api/UserManagement/GetMenuList'),
  getMenuById: (menuId) => apiRequest(`/api/UserManagement/GetMenuById?menuId=${menuId}`),
  saveMenu: (menuData) => apiRequest('/api/UserManagement/SaveMenu', {
    method: 'POST',
    body: JSON.stringify(menuData)
  }),
  updateMenu: (menuData) => apiRequest('/api/UserManagement/UpdateMenu', {
    method: 'PUT',
    body: JSON.stringify(menuData)
  }),
  deleteMenu: (menuId) => apiRequest(`/api/UserManagement/DeleteMenuById?menuId=${menuId}`, {
    method: 'DELETE'
  }),

  // Main Menus
  getMainMenus: () => apiRequest('/api/UserManagement/GetMainMenuList'),
  getMainMenuById: (mainMenuId) => apiRequest(`/api/UserManagement/GetMainMenuById?mainMenuId=${mainMenuId}`),
  saveMainMenu: (mainMenuData) => apiRequest('/api/UserManagement/SaveMainMenu', {
    method: 'POST',
    body: JSON.stringify(mainMenuData)
  }),
  updateMainMenu: (mainMenuData) => apiRequest('/api/UserManagement/UpdateMainMenu', {
    method: 'PUT',
    body: JSON.stringify(mainMenuData)
  }),
  deleteMainMenu: (mainMenuId) => apiRequest(`/api/UserManagement/DeleteMainMenuById?mainMenuId=${mainMenuId}`, {
    method: 'DELETE'
  }),

  // Sub Menus
  getSubMenus: () => apiRequest('/api/UserManagement/GetSubMenuList'),
  getSubMenusByMainMenuId: (mainMenuId) => apiRequest(`/api/UserManagement/GetSubMenuListByMainMenuId?mainMenuId=${mainMenuId}`),
  getSubMenuById: (subMenuId) => apiRequest(`/api/UserManagement/GetSubMenuById?subMenuId=${subMenuId}`),
  saveSubMenu: (subMenuData) => apiRequest('/api/UserManagement/SaveSubMenu', {
    method: 'POST',
    body: JSON.stringify(subMenuData)
  }),
  updateSubMenu: (subMenuData) => apiRequest('/api/UserManagement/UpdateSubMenu', {
    method: 'PUT',
    body: JSON.stringify(subMenuData)
  }),
  deleteSubMenu: (subMenuId) => apiRequest(`/api/UserManagement/DeleteSubMenuById?subMenuId=${subMenuId}`, {
    method: 'DELETE'
  }),

  // Menu Roles
  getMenuRoles: (roleId = null) => {
    const url = roleId 
      ? `/api/UserManagement/GetMenuRoleList?roleId=${roleId}`
      : '/api/UserManagement/GetMenuRoleList';
    return apiRequest(url);
  },
  getMenuRolesByRoleId: (roleId) => apiRequest(`/api/UserManagement/GetMenuRolesByRoleId?roleId=${roleId}`),
  saveMenuRole: (menuRoleData) => apiRequest('/api/UserManagement/SaveMenuRole', {
    method: 'POST',
    body: JSON.stringify(menuRoleData)
  }),
  assignMenuToRole: (menuRoleData) => apiRequest('/api/UserManagement/AssignMenuToRole', {
    method: 'POST',
    body: JSON.stringify(menuRoleData)
  }),
  deleteMenuRole: (menuRoleId) => apiRequest(`/api/UserManagement/DeleteMenuRole/${menuRoleId}`, {
    method: 'DELETE'
  }),
  deleteMenuRoleById: (roleId, menuId) => apiRequest(`/api/UserManagement/DeleteMenuRoleById?roleId=${roleId}&menuId=${menuId}`, {
    method: 'DELETE'
  }),

  // User Roles
  getUserRoles: (userId) => apiRequest(`/api/UserManagement/GetUserRolesByUserId?userId=${userId}`),
  assignUserRole: (userRoleData) => apiRequest('/api/UserManagement/AssignUserRole', {
    method: 'POST',
    body: JSON.stringify(userRoleData)
  }),
  deleteUserRole: (userId, roleId) => apiRequest(`/api/UserManagement/DeleteUserRoleById?userId=${userId}&roleId=${roleId}`, {
    method: 'DELETE'
  }),

  // User Companies
  getUserCompanies: (userId) => apiRequest(`/api/UserManagement/GetUserCompaniesByUserId?userId=${userId}`),
  saveUserCompany: (userCompanyData) => apiRequest('/api/UserManagement/SaveUserCompany', {
    method: 'POST',
    body: JSON.stringify(userCompanyData)
  }),
  deleteUserCompany: (userId, companyId) => apiRequest(`/api/UserManagement/DeleteUserCompanyById?userId=${userId}&companyId=${companyId}`, {
    method: 'DELETE'
  }),
  getUserCompaniesNotAssigned: (userId) => apiRequest(`/api/UserManagement/GetUserCompaniesNotAssignedByUserId?userId=${userId}`),

  // User Menus
  getUserMenu: (userId) => apiRequest(`/api/UserManagement/GetUserMenuByUserId?userId=${userId}`),
  getUserMainMenu: (userId) => apiRequest(`/api/UserManagement/GetUserMainMenuByUserId?userId=${userId}`),
  getUserSubMenu: (empId) => apiRequest(`/api/UserManagement/GetUserSubMenuByEmpId?empId=${empId}`),

  // Login Logs
  getUserLoginLogs: (userId, startDate, endDate) => apiRequest(`/api/UserManagement/GetUserLoginLogsByUserId?userId=${userId}&startDate=${startDate}&endDate=${endDate}`),
  getLoginLogs: (startDate, endDate) => apiRequest(`/api/UserManagement/GetUserLoginLogsList?startDate=${startDate}&endDate=${endDate}`),
  getLastLoginLogs: () => apiRequest('/api/UserManagement/GetUserLastLoginLogsList'),

  // Password Management
  changePassword: (userId, oldPassword, newPassword) => apiRequest(`/api/UserManagement/ChangePassword?userId=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}`),
  resetPassword: (userId, newPassword) => apiRequest(`/api/UserManagement/ResetPassword?userId=${userId}&newPassword=${newPassword}`)
};

// Company Management API functions
export const companyApi = {
  getCompanies: () => apiRequest('/api/companies'),
  getCompanyById: (companyId) => apiRequest(`/api/companies/${companyId}`),
  saveCompany: (companyData) => apiRequest('/api/companies', {
    method: 'POST',
    body: JSON.stringify(companyData)
  }),
  updateCompany: (companyData) => apiRequest('/api/companies', {
    method: 'PUT',
    body: JSON.stringify(companyData)
  }),
  deleteCompany: (companyId) => apiRequest(`/api/companies/${companyId}`, {
    method: 'DELETE'
  })
}; 