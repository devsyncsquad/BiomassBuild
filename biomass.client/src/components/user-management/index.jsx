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
        background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        mb: 3,
        borderRadius: '0 0 24px 24px',
        p: 4,
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
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

      {/* Navigation Tabs */}
      <Box sx={{ mb: 3, mx: 2 }}>
        <Paper elevation={0} sx={{ 
          borderRadius: '16px', 
          bgcolor: 'white', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-scrollButtons': {
                '&.Mui-disabled': { opacity: 0.3 },
              },
              '& .MuiTab-root': {
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 56,
                px: 3,
                color: '#64748b',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#6366F1',
                  bgcolor: 'rgba(99, 102, 241, 0.04)',
                },
                '&.Mui-selected': {
                  color: '#6366F1',
                  fontWeight: 700,
                },
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                height: 3,
                borderRadius: '2px',
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {tab.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: '0.9rem' }}>
                      {tab.label}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>
      </Box>

      {/* Content Area */}
      <Box sx={{ width: '100%', px: 2, pb: 4 }}>
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          minHeight: '600px'
        }}>
          {tabs[activeTab].component}
        </Box>
      </Box>
    </Box>
  );
};

export default UserManagement;
