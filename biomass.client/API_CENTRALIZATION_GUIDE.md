# API Centralization Guide

## Overview
This guide explains how to use the centralized API configuration system in the BiomassPro project. This system allows you to change the API base URL in one place for all environments (development, staging, production).

## Files Involved

### 1. `src/config/config.js` - Main Configuration
This is the **SINGLE SOURCE OF TRUTH** for API URLs.

```javascript
export const config = {
  api: {
    baseUrl: "http://100.42.177.77:88/api", // Change this for different environments
    timeout: 30000,
    retry: { attempts: 3, delay: 1000 }
  }
};

// Helper functions
export const getApiBaseUrl = () => { /* ... */ };
export const getApiUrl = (endpoint) => { /* ... */ };
```

### 2. `src/utils/apiClient.js` - Centralized API Client
Provides a configured axios instance with:
- Automatic base URL resolution
- Authentication token handling
- Error handling
- Timeout configuration

```javascript
import { apiCall } from '../utils/apiClient.js';

// Usage examples
const response = await apiCall.get('/users');
const response = await apiCall.post('/users', userData);
const response = await apiCall.put('/users/123', userData);
const response = await apiCall.delete('/users/123');
```

### 3. `src/utils/api.js` - Legacy API Functions
Contains existing API functions that now use the centralized config.

## How to Change API URL

### For Development
Edit `src/config/config.js`:
```javascript
baseUrl: "http://100.42.177.77:88/api"
```

### For Production
Set environment variable `VITE_LIVE_APP_BASEURL`:
```bash
# In your build process or .env file
VITE_LIVE_APP_BASEURL=https://your-production-domain.com/api
```

## Migration Guide

### Before (Hardcoded URLs)
```javascript
// ❌ Don't do this
const response = await axios.get('http://100.42.177.77:88/api/users');
const response = await fetch('http://100.42.177.77:88/api/users');
```

### After (Centralized)
```javascript
// ✅ Do this instead
import { apiCall } from '../utils/apiClient.js';
const response = await apiCall.get('/users');

// Or for direct fetch
import { getApiUrl } from '../config/config.js';
const response = await fetch(getApiUrl('/users'));
```

## Environment Variables

### Development
- Uses `config.js` baseUrl
- No environment variable needed

### Production
- Set `VITE_LIVE_APP_BASEURL` environment variable
- This overrides the config.js value

### Example .env files
```bash
# .env.development
VITE_LIVE_APP_BASEURL=http://100.42.177.77:88/api

# .env.production
VITE_LIVE_APP_BASEURL=https://api.yourdomain.com/api
```

## Benefits

1. **Single Source of Truth**: Change URL in one place
2. **Environment Management**: Easy switching between dev/staging/prod
3. **Consistent Error Handling**: Centralized error management
4. **Authentication**: Automatic token handling
5. **Type Safety**: Better IDE support and error catching

## Files Updated

The following files have been updated to use the centralized system:
- ✅ `src/config/config.js` - Enhanced with better helper functions
- ✅ `src/utils/api.js` - Updated to use centralized config
- ✅ `src/utils/apiClient.js` - New centralized API client
- ✅ `src/components/CustomerLocationForm.jsx` - Updated vendor API call
- ✅ `src/components/CustomerLocations.jsx` - Updated all API calls

## Next Steps

1. **Update remaining components** to use `apiCall` instead of hardcoded URLs
2. **Set up environment variables** for different deployment environments
3. **Test** that all API calls work with the centralized system
4. **Update build scripts** to use appropriate environment variables

## Quick Reference

```javascript
// Import the API client
import { apiCall } from '../utils/apiClient.js';

// Make API calls
const users = await apiCall.get('/users');
const newUser = await apiCall.post('/users', userData);
const updatedUser = await apiCall.put('/users/123', userData);
const deleted = await apiCall.delete('/users/123');

// For direct fetch (if needed)
import { getApiUrl } from '../config/config.js';
const response = await fetch(getApiUrl('/users'));
```
