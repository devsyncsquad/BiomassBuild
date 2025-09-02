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

      const response = await axios.post('http://100.42.177.77:88/api/UserManagement/SaveUser', userData);
      
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
          top: '8%',
          right: '8%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.1), rgba(34, 139, 34, 0.1))',
          animation: 'float 7s ease-in-out infinite',
          zIndex: 1
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '12%',
          left: '8%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(34, 139, 34, 0.1), rgba(144, 238, 144, 0.1))',
          animation: 'float 9s ease-in-out infinite reverse',
          zIndex: 1
        }}
      />
      
      {/* Additional geometric shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: '55%',
          right: '20%',
          width: 120,
          height: 120,
          borderRadius: '24px',
          background: 'linear-gradient(45deg, rgba(34, 139, 34, 0.08), rgba(144, 238, 144, 0.08))',
          animation: 'float 11s ease-in-out infinite',
          zIndex: 1
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '5%',
          width: 80,
          height: 80,
          borderRadius: '16px',
          background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.06), rgba(34, 139, 34, 0.06))',
          animation: 'float 8s ease-in-out infinite reverse',
          zIndex: 1
        }}
      />

      <Card
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 650,
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
                  transform: 'scale(1.05) rotate(-5deg)',
                  boxShadow: '0 12px 40px rgba(34, 139, 34, 0.4)'
                }
              }}
            >
              <PersonAdd sx={{ fontSize: 45, color: 'white' }} />
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
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Join the Biomass Portal community
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
                      '& textarea': {
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
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 4,
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
                'Create Account'
              )}
            </Button>

            {/* Sign in link */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                Already have an account?{' '}
                <Button
                  onClick={() => navigate('/login')}
                  startIcon={<ArrowBack />}
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
                  Sign in
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
          AI-Driven Safety for Drivers and Vehicles
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

export default Signup;
