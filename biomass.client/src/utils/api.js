// API Configuration and Utility Functions

// Get the base URL from environment variable with fallback
export const getBaseUrl = () => {
  // Check for environment variable first (Vite format)
  if (import.meta.env.VITE_LIVE_APP_BASEURL) {
    return import.meta.env.VITE_LIVE_APP_BASEURL;
  }

  // Fallback to default development URL
  return "https://localhost:7084/api";
};

// Common headers for API requests
export const getHeaders = () => {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  // Don't set Content-Type for FormData, let the browser set it with boundary
  const headers = options.body instanceof FormData 
    ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
    : getHeaders();

  const defaultOptions = {
    headers,
    ...options,
  };

  console.log("API Request:", url, defaultOptions); // Debug log

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
  getUsers: () => apiRequest("/api/UserManagement/GetUsersList"),
  getUserById: (userId) =>
    apiRequest(`/api/UserManagement/GetUserById?userId=${userId}`),
  saveUser: (userData) =>
    apiRequest("/api/UserManagement/SaveUser", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  updateUser: (userData) =>
    apiRequest("/api/UserManagement/UpdateUser", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  deleteUser: (userId) =>
    apiRequest(`/api/UserManagement/DeleteUserById?userId=${userId}`, {
      method: "DELETE",
    }),
  deactivateUser: (userId) =>
    apiRequest(`/api/UserManagement/DeactivateUserById?userId=${userId}`),

  // Roles
  getRoles: () => apiRequest("/api/UserManagement/GetRoleList"),
  getRoleById: (roleId) =>
    apiRequest(`/api/UserManagement/GetRoleById?roleId=${roleId}`),
  saveRole: (roleData) =>
    apiRequest("/api/UserManagement/SaveRole", {
      method: "POST",
      body: JSON.stringify(roleData),
    }),
  updateRole: (roleData) =>
    apiRequest("/api/UserManagement/UpdateRole", {
      method: "PUT",
      body: JSON.stringify(roleData),
    }),
  deleteRole: (roleId) =>
    apiRequest(`/api/UserManagement/DeleteRoleById?roleId=${roleId}`, {
      method: "DELETE",
    }),

  // Menus
  getMenus: () => apiRequest("/api/UserManagement/GetMenuList"),
  getMenuById: (menuId) =>
    apiRequest(`/api/UserManagement/GetMenuById?menuId=${menuId}`),
  saveMenu: (menuData) =>
    apiRequest("/api/UserManagement/SaveMenu", {
      method: "POST",
      body: JSON.stringify(menuData),
    }),
  updateMenu: (menuData) =>
    apiRequest("/api/UserManagement/UpdateMenu", {
      method: "PUT",
      body: JSON.stringify(menuData),
    }),
  deleteMenu: (menuId) =>
    apiRequest(`/api/UserManagement/DeleteMenuById?menuId=${menuId}`, {
      method: "DELETE",
    }),

  // Main Menus
  getMainMenus: () => apiRequest("/api/UserManagement/GetMainMenuList"),
  getMainMenuById: (mainMenuId) =>
    apiRequest(`/api/UserManagement/GetMainMenuById?mainMenuId=${mainMenuId}`),
  saveMainMenu: (mainMenuData) =>
    apiRequest("/api/UserManagement/SaveMainMenu", {
      method: "POST",
      body: JSON.stringify(mainMenuData),
    }),
  updateMainMenu: (mainMenuData) =>
    apiRequest("/api/UserManagement/UpdateMainMenu", {
      method: "PUT",
      body: JSON.stringify(mainMenuData),
    }),
  deleteMainMenu: (mainMenuId) =>
    apiRequest(
      `/api/UserManagement/DeleteMainMenuById?mainMenuId=${mainMenuId}`,
      {
        method: "DELETE",
      }
    ),

  // Sub Menus
  getSubMenus: () => apiRequest("/api/UserManagement/GetSubMenuList"),
  getSubMenusByMainMenuId: (mainMenuId) =>
    apiRequest(
      `/api/UserManagement/GetSubMenuListByMainMenuId?mainMenuId=${mainMenuId}`
    ),
  getSubMenuById: (subMenuId) =>
    apiRequest(`/api/UserManagement/GetSubMenuById?subMenuId=${subMenuId}`),
  saveSubMenu: (subMenuData) =>
    apiRequest("/api/UserManagement/SaveSubMenu", {
      method: "POST",
      body: JSON.stringify(subMenuData),
    }),
  updateSubMenu: (subMenuData) =>
    apiRequest("/api/UserManagement/UpdateSubMenu", {
      method: "PUT",
      body: JSON.stringify(subMenuData),
    }),
  deleteSubMenu: (subMenuId) =>
    apiRequest(`/api/UserManagement/DeleteSubMenuById?subMenuId=${subMenuId}`, {
      method: "DELETE",
    }),

  // Menu Roles
  getMenuRoles: (roleId = null) => {
    const url = roleId
      ? `/api/UserManagement/GetMenuRoleList?roleId=${roleId}`
      : "/api/UserManagement/GetMenuRoleList";
    return apiRequest(url);
  },
  getMenuRolesByRoleId: (roleId) =>
    apiRequest(`/api/UserManagement/GetMenuRolesByRoleId?roleId=${roleId}`),
  saveMenuRole: (menuRoleData) =>
    apiRequest("/api/UserManagement/SaveMenuRole", {
      method: "POST",
      body: JSON.stringify(menuRoleData),
    }),
  assignMenuToRole: (menuRoleData) =>
    apiRequest("/api/UserManagement/AssignMenuToRole", {
      method: "POST",
      body: JSON.stringify(menuRoleData),
    }),
  deleteMenuRole: (menuRoleId) =>
    apiRequest(`/api/UserManagement/DeleteMenuRole/${menuRoleId}`, {
      method: "DELETE",
    }),
  deleteMenuRoleById: (roleId, menuId) =>
    apiRequest(
      `/api/UserManagement/DeleteMenuRoleById?roleId=${roleId}&menuId=${menuId}`,
      {
        method: "DELETE",
      }
    ),

  // User Roles
  getUserRoles: (userId) =>
    apiRequest(`/api/UserManagement/GetUserRolesByUserId?userId=${userId}`),
  assignUserRole: (userRoleData) =>
    apiRequest("/api/UserManagement/AssignUserRole", {
      method: "POST",
      body: JSON.stringify(userRoleData),
    }),
  deleteUserRole: (userId, roleId) =>
    apiRequest(
      `/api/UserManagement/DeleteUserRoleById?userId=${userId}&roleId=${roleId}`,
      {
        method: "DELETE",
      }
    ),

  // User Companies
  getUserCompanies: (userId) =>
    apiRequest(`/api/UserManagement/GetUserCompaniesByUserId?userId=${userId}`),
  saveUserCompany: (userCompanyData) =>
    apiRequest("/api/UserManagement/SaveUserCompany", {
      method: "POST",
      body: JSON.stringify(userCompanyData),
    }),
  deleteUserCompany: (userId, companyId) =>
    apiRequest(
      `/api/UserManagement/DeleteUserCompanyById?userId=${userId}&companyId=${companyId}`,
      {
        method: "DELETE",
      }
    ),
  getUserCompaniesNotAssigned: (userId) =>
    apiRequest(
      `/api/UserManagement/GetUserCompaniesNotAssignedByUserId?userId=${userId}`
    ),

  // User Menus
  getUserMenu: (userId) =>
    apiRequest(`/api/UserManagement/GetUserMenuByUserId?userId=${userId}`),
  getUserMainMenu: (userId) =>
    apiRequest(`/api/UserManagement/GetUserMainMenuByUserId?userId=${userId}`),
  getUserSubMenu: (empId) =>
    apiRequest(`/api/UserManagement/GetUserSubMenuByEmpId?empId=${empId}`),
  getUserAssignedMenusByRole: (roleId) =>
    apiRequest(
      `/api/UserManagement/GetUserAssignedMenusByRoleId?roleId=${roleId}`
    ),

  // Login Logs
  getUserLoginLogs: (userId, startDate, endDate) =>
    apiRequest(
      `/api/UserManagement/GetUserLoginLogsByUserId?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
    ),
  getLoginLogs: (startDate, endDate) =>
    apiRequest(
      `/api/UserManagement/GetUserLoginLogsList?startDate=${startDate}&endDate=${endDate}`
    ),
  getLastLoginLogs: () =>
    apiRequest("/api/UserManagement/GetUserLastLoginLogsList"),

  // Password Management
  changePassword: (userId, oldPassword, newPassword) =>
    apiRequest(
      `/api/UserManagement/ChangePassword?userId=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}`
    ),
  resetPassword: (userId, newPassword) =>
    apiRequest(
      `/api/UserManagement/ResetPassword?userId=${userId}&newPassword=${newPassword}`
    ),
};

// Company Management API functions
export const companyApi = {
  getCompanies: () => apiRequest("/api/companies"),
  getCompanyById: (companyId) => apiRequest(`/api/companies/${companyId}`),
  saveCompany: (companyData) =>
    apiRequest("/api/companies", {
      method: "POST",
      body: JSON.stringify(companyData),
    }),
  updateCompany: (companyData) =>
    apiRequest("/api/companies", {
      method: "PUT",
      body: JSON.stringify(companyData),
    }),
  deleteCompany: (companyId) =>
    apiRequest(`/api/companies/${companyId}`, {
      method: "DELETE",
    }),
};

// Individual exports for backward compatibility
export const getCompanies = () => companyApi.getCompanies();
export const getCompanyById = (companyId) =>
  companyApi.getCompanyById(companyId);
export const createCompany = (companyData) =>
  companyApi.saveCompany(companyData);
export const updateCompany = (companyId, companyData) =>
  companyApi.updateCompany({ id: companyId, ...companyData });
export const deleteCompany = (companyId) => companyApi.deleteCompany(companyId);

// Customer Management API functions
export const customerApi = {
  getCustomers: () => apiRequest("/customers/GetAllCustomers"),
  getCustomerById: (customerId) => apiRequest(`/api/customers/${customerId}`),
  saveCustomer: (customerData) =>
    apiRequest("/api/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    }),
  updateCustomer: (customerData) =>
    apiRequest("/api/customers", {
      method: "PUT",
      body: JSON.stringify(customerData),
    }),
  deleteCustomer: (customerId) =>
    apiRequest(`/api/customers/${customerId}`, {
      method: "DELETE",
    }),
};

// Individual customer exports for backward compatibility
export const getCustomers = () => customerApi.getCustomers();
export const createCustomer = (customerData) =>
  customerApi.saveCustomer(customerData);
export const updateCustomer = (customerId, customerData) =>
  customerApi.updateCustomer({ id: customerId, ...customerData });
export const deleteCustomer = (customerId) =>
  customerApi.deleteCustomer(customerId);

// Material Rates API functions
export const materialRatesApi = {
  getAllMaterialRates: () => apiRequest("/materialrates/GetAllMaterialRates"),
  getMaterialRateById: (id) => apiRequest(`/materialrates/GetMaterialRateById/${id}`),
  getMaterialRatesByLocationId: (locationId) => apiRequest(`/materialrates/GetMaterialRatesByLocationId/${locationId}`),
  checkExistingActiveRates: (customerId, locationId, materialType, effectiveDate) => 
    apiRequest(`/materialrates/CheckExistingActiveRates?customerId=${customerId}&locationId=${locationId}&materialType=${materialType}&effectiveDate=${effectiveDate}`),
  createMaterialRate: (rateData) => apiRequest("/materialrates/CreateMaterialRate", {
    method: "POST",
    body: JSON.stringify(rateData),
  }),
  updateMaterialRate: (id, rateData) => apiRequest(`/materialrates/UpdateMaterialRate/${id}`, {
    method: "PUT",
    body: JSON.stringify(rateData),
  }),
  deleteMaterialRate: (id) => apiRequest(`/materialrates/DeleteMaterialRate/${id}`, {
    method: "DELETE",
  }),
};

// Customer Locations API functions
export const customerLocationsApi = {
  getLocationsByCustomerId: (customerId) => apiRequest(`/customerlocations/GetLocationsByCustomerId/${customerId}`),
  getAllLocations: () => apiRequest("/customerlocations/GetAllLocations"),
  createLocation: (locationData) => apiRequest("/customerlocations/CreateLocation", {
    method: "POST",
    body: JSON.stringify(locationData),
  }),
  updateLocation: (locationId, locationData) => apiRequest(`/customerlocations/UpdateLocation/${locationId}`, {
    method: "PUT",
    body: JSON.stringify(locationData),
  }),
  deleteLocation: (locationId) => apiRequest(`/customerlocations/DeleteLocation/${locationId}`, {
    method: "DELETE",
  }),
};

// Lookup API functions
export const lookupApi = {
  getAllLookups: () => apiRequest("/lookups/GetAllLookups"),
  getLookupsByDomain: (domain) => apiRequest("/lookups/by-domain", {
    method: "POST",
    body: JSON.stringify({ Domain: domain }),
  }),
  createLookup: (lookupData) => apiRequest("/lookups", {
    method: "POST",
    body: JSON.stringify(lookupData),
  }),
  updateLookup: (id, lookupData) => apiRequest(`/lookups/${id}`, {
    method: "PUT",
    body: JSON.stringify(lookupData),
  }),
  deleteLookup: (id) => apiRequest(`/lookups/${id}`, {
    method: "DELETE",
  }),
};