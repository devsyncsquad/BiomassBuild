import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import CompanyManagement from './components/CompanyManagement';
import CustomerManagement from './components/CustomerManagement';
import CustomerLocations from './components/CustomerLocations';
import VendorManagement from './components/VendorManagement';
import UserManagement from './components/user-management';
import MoneyAccount from './components/MoneyAccount';
import CostCenters from './components/CostCenters';
import './App.css';
import { Box, Card, CardContent, Grid, Typography, Button } from '@mui/material';
import { isAuthenticated, getCurrentUser, logout } from './utils/auth';

// Create a professional theme based on Vendor Management styling
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#1f2937',
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1f2937',
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#2563eb',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1f2937',
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#1f2937',
    },
    h6: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: '#1f2937',
    },
    body1: {
      fontSize: '0.8rem',
      color: '#374151',
    },
    body2: {
      fontSize: '0.75rem',
      color: '#6b7280',
    },
    button: {
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 4, // Reduce base spacing unit from 8 to 4
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        },
        sizeSmall: {
          fontSize: '0.75rem',
          padding: '4px 12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2563eb',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2563eb',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.8rem',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableHead-root': {
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            '& .MuiTableCell-root': {
              color: 'white',
              fontWeight: 600,
              fontSize: '0.8rem',
              borderBottom: 'none',
              padding: '8px 12px',
            },
          },
          '& .MuiTableBody-root .MuiTableCell-root': {
            fontSize: '0.8rem',
            padding: '8px 12px',
            borderBottom: '1px solid #f3f4f6',
          },
          '& .MuiTableRow-root:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: '0.7rem',
          fontWeight: 600,
          padding: '2px 6px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        sizeSmall: {
          fontSize: '0.65rem',
          height: 20,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'none',
            minHeight: 40,
          },
          '& .MuiTab-root.Mui-selected': {
            color: '#2563eb',
          },
          '& .MuiTabs-indicator': {
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            height: 2,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 4,
          '&.MuiIconButton-sizeSmall': {
            padding: 2,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
          padding: '8px 12px',
        },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return null;
  }
  return children;
};

// Layout component that wraps content with Dashboard sidebar
const Layout = ({ children }) => {
  const [user, setUser] = useState(() => {
    return isAuthenticated() ? getCurrentUser() : null;
  });

  // Check session expiration every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        // Session expired, logout user
        handleLogout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  // If no user, redirect to login
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return <Dashboard user={user} onLogout={handleLogout}>{children}</Dashboard>;
};

// DashboardHome component for the main dashboard view
const DashboardHome = () => {
  const navigate = useNavigate();
  
  const dashboardItems = [
    {
      title: 'Total Users',
      value: '150',
      icon: '👥',
      color: '#2196F3'
    },
    {
      title: 'Active Roles',
      value: '8',
      icon: '🔐',
      color: '#4CAF50'
    },
    {
      title: 'Companies',
      value: '25',
      icon: '🏢',
      color: '#FF9800'
    },
    {
      title: 'Customers',
      value: '89',
      icon: '👤',
      color: '#9C27B0'
    },
    {
      title: 'Vendors',
      value: '248',
      icon: '🏪',
      color: '#E91E63'
    }
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h4" gutterBottom sx={{ p: 3, pb: 1 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4, px: 3 }}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${item.color}15, ${item.color}25)`,
                border: `1px solid ${item.color}30`
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: item.color }}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ opacity: 0.7 }}>
                    {item.icon}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ px: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4CAF50' }} />
                  <Typography variant="body2">New customer registered: John Doe</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    2 min ago
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2196F3' }} />
                  <Typography variant="body2">Role updated: Administrator</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    15 min ago
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF9800' }} />
                  <Typography variant="body2">Company added: Tech Corp</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    1 hour ago
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate('/user-management')}
                >
                  Manage Users
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate('/company-management')}
                >
                  Manage Companies
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate('/customer-management')}
                >
                  Manage Customers
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => navigate('/vendor-management')}
                >
                  Manage Vendors
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes with Dashboard layout */}
            <Route path="/" element={<ProtectedRoute><Layout><DashboardHome /></Layout></ProtectedRoute>} />
            <Route path="/company-management" element={<ProtectedRoute><Layout><CompanyManagement /></Layout></ProtectedRoute>} />
            <Route path="/customer-management" element={<ProtectedRoute><Layout><CustomerManagement /></Layout></ProtectedRoute>} />
            <Route path="/customer-locations" element={<ProtectedRoute><Layout><CustomerLocations /></Layout></ProtectedRoute>} />
            <Route path="/vendor-management" element={<ProtectedRoute><Layout><VendorManagement /></Layout></ProtectedRoute>} />
            <Route path="/user-management" element={<ProtectedRoute><Layout><UserManagement /></Layout></ProtectedRoute>} />
            <Route path="/money-account" element={<ProtectedRoute><Layout><MoneyAccount /></Layout></ProtectedRoute>} />
            <Route path="/cost-centers" element={<ProtectedRoute><Layout><CostCenters /></Layout></ProtectedRoute>} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;

