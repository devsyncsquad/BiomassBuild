import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getBaseUrl } from '../utils/api';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { isAuthenticated } from '../utils/auth';

const Login = ({ onLoginSuccess }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      // User is already logged in and session is valid
      navigate('/');
    }
  }, [navigate]);

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${getBaseUrl()}/users/authenticate`, {
        username: username,
        password: password
      });

      if (response.data && response.data.token) {
        console.log('=== LOGIN RESPONSE DEBUG ===');
        console.log('Full response data:', response.data);
        console.log('Customers data:', response.data.customers);
        console.log('Assigned menus data:', response.data.assignedMenus);
        console.log('Role ID:', response.data.roleId);
        
        // Store JWT token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          userId: response.data.userId,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          username: response.data.username,
          empId: response.data.empId,
          roleId: response.data.roleId
        }));
        
        // Store customers data if available
        if (response.data.customers && response.data.customers.length > 0) {
          console.log('Storing customers in localStorage:', response.data.customers);
          localStorage.setItem('customers', JSON.stringify(response.data.customers));
        } else {
          console.log('No customers data, storing empty array');
          localStorage.setItem('customers', JSON.stringify([]));
        }
        
        // Store role information
        if (response.data.roleId) {
          console.log('Storing role ID in localStorage:', response.data.roleId);
          localStorage.setItem('userRole', response.data.roleId.toString());
        }
        
        // Store assigned menus data if available
        if (response.data.assignedMenus && response.data.assignedMenus.length > 0) {
          console.log('Storing assigned menus in localStorage:', response.data.assignedMenus);
          localStorage.setItem('assignedMenus', JSON.stringify(response.data.assignedMenus));
        } else {
          console.log('No assigned menus data, storing empty array');
          localStorage.setItem('assignedMenus', JSON.stringify([]));
        }
        
        console.log('=== END LOGIN RESPONSE DEBUG ===');
        
        // Set token expiration (24 hours from now)
        const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
        
        // Call the login success callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }
        
        // Redirect to dashboard
        navigate('/');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #228B22 0%, #32CD32 50%, #90EE90 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("/DS_Login1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: 0
        }
      }}
    >
      {/* Modern geometric background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(34, 139, 34, 0.1), rgba(144, 238, 144, 0.1))',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.1), rgba(34, 139, 34, 0.1))',
          animation: 'float 6s ease-in-out infinite reverse',
          zIndex: 1
        }}
      />
      
      {/* Additional geometric shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '15%',
          width: 100,
          height: 100,
          borderRadius: '20px',
          background: 'linear-gradient(45deg, rgba(34, 139, 34, 0.08), rgba(144, 238, 144, 0.08))',
          animation: 'float 10s ease-in-out infinite',
          zIndex: 1
        }}
      />

      <Card
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 450,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(34, 139, 34, 0.1)',
          position: 'relative',
          zIndex: 2,
          transform: 'translateY(0)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-12px)',
            boxShadow: '0 32px 64px rgba(34, 139, 34, 0.2)'
          }
        }}
      >
        <CardContent sx={{ p: 6 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 32px rgba(34, 139, 34, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) rotate(5deg)',
                  boxShadow: '0 12px 40px rgba(34, 139, 34, 0.4)'
                }
              }}
            >
              <LoginIcon sx={{ fontSize: 45, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                letterSpacing: '-0.5px'
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Sign in to your Biomass Portal account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: '16px',
                border: '1px solid rgba(211, 47, 47, 0.2)',
                '& .MuiAlert-icon': {
                  color: '#d32f2f'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    '& fieldset': {
                      borderColor: '#228B22',
                      borderWidth: '2px'
                    }
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    '& fieldset': {
                      borderColor: '#228B22',
                      borderWidth: '2px'
                    }
                  },
                  '& input': {
                    color: '#333',
                    fontSize: '1rem',
                    fontWeight: 500
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#228B22',
                    fontWeight: 600
                  },
                  '&.Mui-shrink': {
                    color: '#228B22',
                    fontWeight: 600
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={isPasswordShown ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={loading}
                      sx={{
                        color: '#228B22',
                        '&:hover': {
                          backgroundColor: 'rgba(34, 139, 34, 0.1)'
                        }
                      }}
                    >
                      {isPasswordShown ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    '& fieldset': {
                      borderColor: '#228B22',
                      borderWidth: '2px'
                    }
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    '& fieldset': {
                      borderColor: '#228B22',
                      borderWidth: '2px'
                    }
                  },
                  '& input': {
                    color: '#333',
                    fontSize: '1rem',
                    fontWeight: 500
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: '#228B22',
                    fontWeight: 600
                  },
                  '&.Mui-shrink': {
                    color: '#228B22',
                    fontWeight: 600
                  }
                }
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 2,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(34, 139, 34, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1a6b1a 0%, #28a428 100%)',
                  boxShadow: '0 12px 32px rgba(34, 139, 34, 0.4)',
                  transform: 'translateY(-2px)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                },
                '&:disabled': {
                  background: '#ccc',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Sign up link */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                Don't have an account?{' '}
                <Button
                  onClick={() => navigate('/signup')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    color: '#228B22',
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'rgba(34, 139, 34, 0.1)',
                      borderRadius: '8px'
                    }
                  }}
                >
                  Create one
                </Button>
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ 
            textAlign: 'center', 
            mt: 5, 
            pt: 3, 
            borderTop: '1px solid rgba(34, 139, 34, 0.1)' 
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              © {new Date().getFullYear()} Biomass Portal. All rights reserved.
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.9rem' }}>
              Version 1.0.0
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Brand tagline */}
      <Box
        sx={{
          position: 'absolute',
          top: 30,
          right: 30,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          px: 4,
          py: 2,
          zIndex: 3,
          border: '1px solid rgba(34, 139, 34, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#228B22', mb: 0.5 }}>
          AI-Driven Safety for You
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          Powered by Biomass
        </Typography>
      </Box>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(2deg); }
        }
      `}</style>
    </Box>
  );
};

export default Login;
