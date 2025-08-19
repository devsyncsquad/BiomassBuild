// React Imports
import React, { useState } from 'react';

// MUI Imports
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Paper
} from '@mui/material';
import {
  People as PeopleIcon,
  Security as SecurityIcon,
  Menu as MenuIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

// Component Imports
import Users from './users';
import Roles from './roles';
import Menus from './addMenu';
import AssignMenus from './assignMenus';
import Companies from './companies';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Users', icon: <PeopleIcon />, component: <Users /> },
    { label: 'Roles', icon: <SecurityIcon />, component: <Roles /> },
    { label: 'Menus', icon: <MenuIcon />, component: <Menus /> },
    { label: 'Assign Menus', icon: <AssignmentIcon />, component: <AssignMenus /> },
    { label: 'Companies', icon: <BusinessIcon />, component: <Companies /> }
  ];

  return (
    <Box sx={{ width: '100%', p: 0, minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
        mb: 3,
        borderRadius: '0 0 24px 24px',
        p: 4,
        boxShadow: '0 8px 32px rgba(34, 139, 34, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(50px, -50px)'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ 
              color: 'white', 
              mb: 1, 
              fontWeight: 800, 
              fontSize: '2rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              User Management
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.95)', 
              fontSize: '1rem',
              fontWeight: 400,
              maxWidth: '500px'
            }}>
              Manage users, roles, menus, and company assignments with advanced security controls
            </Typography>
          </Box>
          <Avatar sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: 'rgba(255,255,255,0.15)',
            border: '3px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <PeopleIcon sx={{ fontSize: 32, color: 'white' }} />
          </Avatar>
        </Box>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Paper sx={{ 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(34, 139, 34, 0.08)',
          border: '1px solid rgba(34, 139, 34, 0.1)'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'none',
                '&.Mui-selected': {
                  color: '#228B22',
                  fontWeight: 700
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#228B22',
                height: 3
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      color: activeTab === index ? '#228B22' : '#6B7280',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {tab.icon}
                    </Box>
                    {tab.label}
                  </Box>
                }
                sx={{
                  minHeight: 64,
                  px: 3
                }}
              />
            ))}
          </Tabs>
        </Paper>
      </Box>

      {/* Content Section */}
      <Box sx={{ px: 3, pb: 6 }}>
        <Box sx={{ 
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(34, 139, 34, 0.08)',
          border: '1px solid rgba(34, 139, 34, 0.1)',
          bgcolor: 'white'
        }}>
          {tabs[activeTab].component}
        </Box>
      </Box>
    </Box>
  );
};

export default UserManagement;
