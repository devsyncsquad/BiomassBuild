// React Imports
import React, { useState } from 'react';

// MUI Imports
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar
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
    <Box sx={{ width: '100%', p: 0 }}>
      {/* Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        mb: 2,
        borderRadius: 0,
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', mb: 0.5, fontWeight: 700, fontSize: '1.25rem' }}>
              User Management
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>
              Manage users, roles, menus, and company assignments
            </Typography>
          </Box>
          <Avatar sx={{ 
            width: 48, 
            height: 48, 
            bgcolor: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            <PeopleIcon sx={{ fontSize: 24, color: 'white' }} />
          </Avatar>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ mb: 2, borderRadius: 0, bgcolor: 'background.paper', boxShadow: 1, mx: 0 }}>
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
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 48,
              px: 2,
              '&.Mui-selected': {
                color: '#2563eb',
              },
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              height: 2,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {tab.icon}
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    {tab.label}
                  </Typography>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ width: '100%', px: 3 }}>
        {tabs[activeTab].component}
      </Box>
    </Box>
  );
};

export default UserManagement;
