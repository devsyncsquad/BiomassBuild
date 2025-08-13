# URL Routing Implementation

This document explains how URL routing has been implemented in the Biomass Portal application.

## Overview

The application now supports direct URL navigation, allowing users to access specific pages by typing URLs in the browser address bar.

## Available Routes

### Public Routes (No Authentication Required)
- `/login` - Login page
- `/signup` - Registration page

### Protected Routes (Authentication Required)
- `/dashboard` - Main dashboard (default landing page)
- `/` - Redirects to `/dashboard`

### Default Behavior
- Any unknown route (`*`) redirects to `/dashboard`
- If user is not authenticated and tries to access protected routes, they are redirected to `/login`
- If user is authenticated and tries to access public routes, they are redirected to `/dashboard`

## How to Use

### Direct URL Access
You can now directly navigate to any route by typing the URL in your browser:

```
http://localhost:5173/dashboard
http://localhost:5173/login
http://localhost:5173/signup
```

### Navigation from Components
The application uses React Router for navigation. Components can navigate programmatically:

```javascript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  // Navigate to dashboard
  navigate('/dashboard');
  
  // Navigate to login
  navigate('/login');
  
  // Navigate to signup
  navigate('/signup');
};
```

### Browser Back/Forward Buttons
The routing implementation supports browser back and forward buttons, maintaining the application state.

## Authentication Flow

1. **Unauthenticated User**:
   - Accessing `/dashboard` → Redirected to `/login`
   - Accessing `/` → Redirected to `/login`

2. **Authenticated User**:
   - Accessing `/login` → Redirected to `/dashboard`
   - Accessing `/signup` → Redirected to `/dashboard`
   - Accessing `/dashboard` → Allowed

## Implementation Details

### Protected Routes
Protected routes are wrapped with a `ProtectedRoute` component that checks for authentication:

```javascript
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

### Public Routes
Public routes are wrapped with a `PublicRoute` component that redirects authenticated users:

```javascript
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};
```

## Production Deployment

For production deployment, ensure your hosting platform is configured to handle client-side routing:

### For Netlify
The `_redirects` file in the `public` folder handles routing.

### For IIS
The `web.config` file in the `public` folder handles routing.

### For Apache
Add a `.htaccess` file with:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### For Nginx
Add to your nginx configuration:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Testing

To test the routing:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test direct URL access**:
   - Navigate to `http://localhost:5173/dashboard`
   - Navigate to `http://localhost:5173/login`
   - Navigate to `http://localhost:5173/signup`

3. **Test authentication flow**:
   - Try accessing `/dashboard` without logging in (should redirect to `/login`)
   - Login and try accessing `/login` (should redirect to `/dashboard`)

4. **Test browser navigation**:
   - Use browser back/forward buttons
   - Bookmark pages and access them directly

## Troubleshooting

### Common Issues

1. **404 Errors on Refresh**:
   - Ensure your hosting platform is configured for client-side routing
   - Check that the appropriate configuration files are in place

2. **Infinite Redirects**:
   - Check authentication logic in `ProtectedRoute` and `PublicRoute` components
   - Verify localStorage token and user data are properly set/cleared

3. **Routes Not Working**:
   - Ensure React Router is properly installed
   - Check that all route components are properly imported
   - Verify the Router component wraps the entire application

### Debug Mode

To debug routing issues, you can add console logs to the route components:

```javascript
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  console.log('ProtectedRoute - Token:', !!token, 'UserData:', !!userData);
  
  if (!token || !userData) {
    console.log('Redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

## Future Enhancements

Potential improvements for the routing system:

1. **Route Guards**: More granular permission-based routing
2. **Lazy Loading**: Code splitting for better performance
3. **Route Parameters**: Dynamic routing with URL parameters
4. **Query Parameters**: Support for URL query strings
5. **Route History**: Better handling of navigation history
6. **Error Boundaries**: Graceful error handling for route failures 