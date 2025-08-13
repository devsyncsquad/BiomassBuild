import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import Grid from '@mui/material/Grid';
import { Visibility, VisibilityOff, PersonAdd, ArrowBack } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

const Signup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    passwordHash: '',
    empNo: '',
    phoneNumber: '',
    isTeamLead: 'N',
    enabled: 'Y',
    comments: 'User created via signup',
    reportingTo: 0,
    roleId: 2,
    createdBy: 1
  });
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClickShowPassword = () => setIsPasswordShown((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format the data according to the Users model
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        passwordHash: formData.passwordHash,
        empNo: formData.empNo ? parseInt(formData.empNo) : null,
        phoneNumber: formData.phoneNumber,
        isTeamLead: formData.isTeamLead,
        enabled: formData.enabled,
        comments: formData.comments,
        reportingTo: formData.reportingTo,
        roleId: formData.roleId
      };

      const response = await axios.post('https://localhost:7084/api/UserManagement/SaveUser', userData);
      
      if (response.data && response.data.success) {
        alert('Account created successfully! Please login.');
        navigate('/login');
      } else {
        setError(response.data?.message || 'Signup failed. Please try again.');
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          opacity: 0.3,
          zIndex: 0
        }
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: alpha(theme.palette.secondary.main, 0.1),
          animation: 'float 7s ease-in-out infinite',
          zIndex: 1
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: alpha(theme.palette.primary.main, 0.1),
          animation: 'float 9s ease-in-out infinite reverse',
          zIndex: 1
        }}
      />

      <Card
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 600,
          borderRadius: 4,
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
          zIndex: 2,
          transform: 'translateY(0)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[25]
          }
        }}
      >
        <CardContent sx={{ p: 6 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: theme.shadows[8]
              }}
            >
              <PersonAdd sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join the Biomass Portal community
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Signup Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  variant="outlined"
                  name="empNo"
                  type="number"
                  value={formData.empNo}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={isPasswordShown ? 'text' : 'password'}
                  variant="outlined"
                  name="passwordHash"
                  value={formData.passwordHash}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                          disabled={loading}
                        >
                          {isPasswordShown ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role ID"
                  variant="outlined"
                  name="roleId"
                  type="number"
                  value={formData.roleId}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  variant="outlined"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  disabled={loading}
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </Grid>
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: theme.shadows[8]
                },
                '&:disabled': {
                  background: theme.palette.action.disabledBackground
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Sign in link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button
                  onClick={() => navigate('/login')}
                  startIcon={<ArrowBack />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                >
                  Sign in
                </Button>
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} Biomass Portal. All rights reserved.
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
              Version 1.0.0
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Brand tagline */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          px: 3,
          py: 1.5,
          zIndex: 3
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          AI-Driven Safety for Drivers and Vehicles
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Powered by Biomass
        </Typography>
      </Box>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
};

export default Signup;
