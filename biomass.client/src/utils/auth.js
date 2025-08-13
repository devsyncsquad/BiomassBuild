// Authentication utility functions

// Check if user is authenticated and session is valid
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  
  if (!token || !expiresAt) {
    return false;
  }
  
  // Check if token is expired
  if (new Date().getTime() > parseInt(expiresAt)) {
    // Clear expired session
    logout();
    return false;
  }
  
  return true;
};

// Get the current user data
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get the authentication token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get authentication headers for API calls
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Logout user and clear session
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiresAt');
  window.location.href = '/login';
};

// Check if session is about to expire (within 5 minutes)
export const isSessionExpiringSoon = () => {
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  if (!expiresAt) return false;
  
  const fiveMinutesFromNow = new Date().getTime() + (5 * 60 * 1000);
  return parseInt(expiresAt) < fiveMinutesFromNow;
};

// Refresh session (extend by 24 hours)
export const refreshSession = () => {
  const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000);
  localStorage.setItem('tokenExpiresAt', expiresAt.toString());
};
