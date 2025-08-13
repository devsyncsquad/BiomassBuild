import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import './Dashboard.css';
import { logout } from '../utils/auth';

const DRAWER_WIDTH = 280;

const Dashboard = ({ user, onLogout, children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (menuId) => {
    if (children) {
      // If children are provided, navigate to the route
      switch (menuId) {
        case 'dashboard':
          navigate('/');
          break;
        case 'user-management':
          navigate('/user-management');
          break;
        case 'company-management':
          navigate('/company-management');
          break;
        case 'customer-management':
          navigate('/customer-management');
          break;
        case 'vendor-management':
          navigate('/vendor-management');
          break;
        case 'banking-finance':
          navigate('/banking-finance');
          break;
        default:
          break;
      }
    } else {
      // If no children, use internal state
      // setCurrentView(menuId); // This line is removed
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      color: '#667eea'
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: <PeopleIcon />,
      color: '#2196F3'
    },
    {
      id: 'company-management',
      label: 'Company Management',
      icon: <BusinessIcon />,
      color: '#FF9800'
    },
    {
      id: 'customer-management',
      label: 'Customer & Location Management',
      icon: <LocationOnIcon />,
      color: '#4CAF50'
    },
    {
      id: 'vendor-management',
      label: 'Vendor Management',
      icon: <StorefrontIcon />,
      color: '#9C27B0'
    },
    {
      id: 'banking-finance',
      label: 'Banking & Finance',
      icon: <AccountBalanceIcon />,
      color: '#FF5722'
    }
  ];

  const renderContent = () => {
    // If children are provided, render them instead of the default content
    if (children) {
      return children;
    }

    // If no children, show a simple message
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Biomass Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please select a menu item from the sidebar to get started.
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Biomass Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
              {user?.firstName?.charAt(0) || user?.userName?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="body2">
              {user?.firstName || user?.userName || 'User'}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: 'transparent', // Removed currentView check
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 400 // Removed currentView check
                    } 
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ mx: 1, borderRadius: 2 }}>
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '100vh' }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
