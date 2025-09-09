// Centralized API Client
// This file provides a centralized way to make API calls using the configured base URL

import { getApiUrl } from '../config/config.js';
import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to make API calls with the configured base URL
export const apiCall = {
  get: (endpoint, config = {}) => {
    return apiClient.get(getApiUrl(endpoint), config);
  },
  
  post: (endpoint, data = {}, config = {}) => {
    return apiClient.post(getApiUrl(endpoint), data, config);
  },
  
  put: (endpoint, data = {}, config = {}) => {
    return apiClient.put(getApiUrl(endpoint), data, config);
  },
  
  delete: (endpoint, config = {}) => {
    return apiClient.delete(getApiUrl(endpoint), config);
  },
  
  patch: (endpoint, data = {}, config = {}) => {
    return apiClient.patch(getApiUrl(endpoint), data, config);
  }
};

// Export the configured axios instance for direct use if needed
export default apiClient;
