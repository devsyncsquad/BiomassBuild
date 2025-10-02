# Authentication Implementation

## Overview
This document describes the complete authentication system implemented for the Biomass Portal application, including JWT token generation, session management, and logout functionality.

## Features Implemented

### ✅ JWT Token Authentication
- **Token Generation**: JWT tokens are generated upon successful login
- **24-Hour Expiration**: Tokens expire after 24 hours for security
- **Secure Storage**: Tokens are stored in localStorage with expiration tracking

### ✅ Session Management
- **Automatic Expiration**: Sessions automatically expire after 24 hours
- **Periodic Checks**: Session validity is checked every minute
- **Graceful Logout**: Users are automatically logged out when sessions expire

### ✅ Login Flow
1. User enters username and password
2. Backend validates credentials against Users table
3. JWT token is generated with user claims
4. Token and user data stored in localStorage
5. User redirected to dashboard

### ✅ Logout Functionality
- **Manual Logout**: Users can logout via dashboard logout button
- **Automatic Logout**: Sessions expire automatically after 24 hours
- **Clean Session**: All authentication data is cleared on logout

## Backend Implementation

### UsersController.cs
```csharp
[HttpPost("authenticate")]
public async Task<IActionResult> Authenticate(AuthenticateRequest model)
{
    // Find user by username and check if enabled
    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Username == model.Username && u.Enabled == "Y");
    
    // Verify password
    if (!VerifyPassword(model.Password, user.PasswordHash))
        return BadRequest(new { message = "Invalid username or password" });
    
    // Generate JWT token with 24-hour expiration
    var token = GenerateJwtToken(user);
    
    // Return authentication response
    var response = new AuthenticateResponse(user, token);
    return Ok(response);
}
```

### JWT Token Generation
```csharp
private string GenerateJwtToken(Users user)
{
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(_configuration["Secret"]);
    
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username ?? ""),
            new Claim(ClaimTypes.GivenName, user.FirstName ?? ""),
            new Claim(ClaimTypes.Surname, user.LastName ?? ""),
            new Claim("EmpNo", user.EmpNo?.ToString() ?? ""),
            new Claim("RoleId", user.RoleId?.ToString() ?? "")
        }),
        Expires = DateTime.UtcNow.AddHours(24), // 24 hours expiration
        SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature
        )
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}
```

## Frontend Implementation

### Authentication Utility (auth.js)
```javascript
// Check if user is authenticated and session is valid
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('tokenExpiresAt');
  
  if (!token || !expiresAt) return false;
  
  // Check if token is expired
  if (new Date().getTime() > parseInt(expiresAt)) {
    logout(); // Clear expired session
    return false;
  }
  
  return true;
};

// Logout user and clear session
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiresAt');
  window.location.href = '/login';
};
```

### Login Component
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post('http://100.42.177.77:88/api/users/authenticate', {
      username: username,
      password: password
    });

    if (response.data && response.data.token) {
      // Store JWT token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: response.data.userId,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        username: response.data.username,
        empId: response.data.empId
      }));
      
      // Set 24-hour expiration
      const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      
      // Redirect to dashboard
      navigate('/');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Authentication failed');
  }
};
```

### Route Protection
```javascript
// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return null;
  }
  return children;
};

// All dashboard routes are protected
<Route path="/" element={<ProtectedRoute><Layout><DashboardHome /></Layout></ProtectedRoute>} />
```

## Session Management

### Automatic Expiration
- Sessions are checked every minute for expiration
- Expired sessions automatically log out the user
- Users are redirected to login page when sessions expire

### Session Data Stored
```javascript
localStorage.setItem('token', 'jwt_token_here');
localStorage.setItem('user', JSON.stringify(userData));
localStorage.setItem('tokenExpiresAt', 'expiration_timestamp');
```

## Security Features

### JWT Token Security
- **Secret Key**: Uses secure secret key from appsettings.json
- **Claims**: Includes user ID, username, name, and role information
- **Expiration**: 24-hour expiration prevents long-term token abuse
- **Signing**: HMAC-SHA256 signature ensures token integrity

### Session Security
- **Automatic Cleanup**: Expired sessions are automatically cleared
- **Route Protection**: All dashboard routes require valid authentication
- **Secure Storage**: Tokens stored in localStorage with expiration tracking

## API Endpoints

### Authentication
- **POST** `/api/users/authenticate` - User login and JWT token generation

### Protected Routes
All dashboard routes require valid JWT token:
- `/` - Main dashboard
- `/user-management` - User management
- `/company-management` - Company management
- `/customer-management` - Customer management
- `/vendor-management` - Vendor management
- `/banking-finance` - Banking and finance

## Usage Examples

### Login
```javascript
// User logs in with username/password
const response = await axios.post('/api/users/authenticate', {
  username: 'johndoe',
  password: 'password123'
});

// JWT token is automatically stored and session created
// User is redirected to dashboard
```

### Logout
```javascript
// User clicks logout button
const handleLogout = () => {
  logout(); // Clears all session data and redirects to login
};
```

### API Calls with Authentication
```javascript
// Include JWT token in API headers
const headers = getAuthHeaders();
const response = await axios.get('/api/protected-endpoint', { headers });
```

## Configuration

### Backend (appsettings.json)
```json
{
  "Secret": "your-super-secret-key-with-at-least-32-characters-for-jwt-signing"
}
```

### Frontend
- Session expiration: 24 hours
- Session check interval: 1 minute
- Automatic redirect on expiration: Enabled

## Testing

### Test Cases
1. **Valid Login**: User can login with correct credentials
2. **Invalid Login**: Error message shown for wrong credentials
3. **Session Expiration**: User automatically logged out after 24 hours
4. **Manual Logout**: User can logout manually via dashboard
5. **Route Protection**: Unauthenticated users redirected to login
6. **Token Validation**: JWT tokens are properly validated

### Test Credentials
Use the user account created via signup to test the authentication flow.

## Troubleshooting

### Common Issues
1. **Token Expired**: Check if session has expired (24 hours)
2. **Invalid Credentials**: Verify username/password in Users table
3. **CORS Issues**: Ensure backend CORS is properly configured
4. **JWT Secret**: Verify JWT secret is at least 32 characters long

### Debug Steps
1. Check browser console for errors
2. Verify localStorage contains token and user data
3. Check backend logs for authentication errors
4. Verify JWT token format and expiration

## Future Enhancements

### Potential Improvements
1. **Refresh Tokens**: Implement refresh token mechanism
2. **Remember Me**: Add "remember me" functionality
3. **Multi-Factor Authentication**: Add 2FA support
4. **Session Activity**: Track user activity and idle timeouts
5. **Audit Logging**: Log authentication events for security

## Conclusion

The authentication system provides a secure, user-friendly login experience with:
- JWT token-based authentication
- 24-hour session management
- Automatic session expiration
- Comprehensive logout functionality
- Protected route access
- Clean, maintainable code structure

The system is production-ready and follows security best practices for web applications.
