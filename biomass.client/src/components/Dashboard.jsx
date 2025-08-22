<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> develop
import { useState, useEffect } from 'react';
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import './Dashboard.css';
import { logout, getUserRole, getUserCustomers, getUserAssignedMenus } from '../utils/auth';
<<<<<<< HEAD
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import "./Dashboard.css";
import { logout, getUserRole, getUserCustomers } from "../utils/auth";
>>>>>>> cost-center
=======
>>>>>>> develop

const DRAWER_WIDTH = 280;

const Dashboard = ({ user, onLogout, children }) => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [customerCount, setCustomerCount] = useState(0);
  const [assignedMenus, setAssignedMenus] = useState([]);

  useEffect(() => {
    // Get customers from localStorage
    const customersData = localStorage.getItem('customers');
    if (customersData) {
      try {
        const parsedCustomers = JSON.parse(customersData);
        setCustomers(parsedCustomers);
        setCustomerCount(parsedCustomers.length);
      } catch (error) {
        console.error('Error parsing customers data:', error);
      }
    }
    
    // Get user role from localStorage
    const role = getUserRole();
    setUserRole(role);

    // Get assigned menus from localStorage
    const assignedMenusData = getUserAssignedMenus();
    console.log('Assigned menus from localStorage:', assignedMenusData);
    setAssignedMenus(assignedMenusData);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (route) => {
    if (children) {
      // If children are provided, navigate to the route
      switch (route) {
        case 'dashboard':
          navigate('/');
<<<<<<< HEAD
          break;
        case 'user-management':
          navigate('/user-management');
          break;
        case 'company-management':
          navigate('/company-management');
=======
>>>>>>> develop
          break;
        case 'customer-management':
          navigate('/customer-management');
          break;
        case 'vendor-management':
          navigate('/vendor-management');
          break;
<<<<<<< HEAD
        case 'money-account':
          navigate('/money-account');
=======
        case "money-account":
          navigate("/money-account");
          break;
        case "cost-centers":
          navigate("/cost-centers");
          break;
        case "lookup-management":
          navigate("/lookup-management");
>>>>>>> cost-center
          break;
        default:
          break;
      }
    } else {
      // If no children, use internal state
      // setCurrentView(route); // This line is removed
    }
  };

  // Define all possible menu items with their IDs that match the backend menu IDs
  const allMenuItems = [
    {
      id: 1, // Dashboard
      label: 'Dashboard',
      icon: <DashboardIcon />,
      color: '#667eea',
      route: 'dashboard'
    },
    {
      id: 2, // User Management
      label: 'User Management',
      icon: <PeopleIcon />,
      color: '#2196F3',
      route: 'user-management'
    },
    {
      id: 3, // Company Management
      label: 'Company Management',
      icon: <BusinessIcon />,
      color: '#FF9800',
      route: 'company-management'
    },
    {
      id: 4, // Customer & Location Management
      label: 'Customer & Location Management',
      icon: <LocationOnIcon />,
      color: '#4CAF50',
      route: 'customer-management'
    },
    {
      id: 5, // Vendor Management
      label: 'Vendor Management',
      icon: <StorefrontIcon />,
      color: '#9C27B0',
      route: 'vendor-management'
    },
    {
      id: 6, // Money Account
      label: 'Money Account',
      icon: <AccountBalanceIcon />,
<<<<<<< HEAD
      color: '#FF5722',
      route: 'money-account'
    }
<<<<<<< HEAD
=======
      color: "#FF5722",
    },
    {
      id: "cost-centers",
      label: "Cost Centers",
      icon: <AccountTreeIcon />,
      color: "#795548",
    },
    {
      id: "lookup-management",
      label: "LookUp Management",
      icon: <AccountBalanceIcon />,
      color: "#607D8B",
    },
>>>>>>> cost-center
=======
>>>>>>> develop
  ];

  // Filter menu items based on user's assigned menus
  const getFilteredMenuItems = () => {
    console.log('=== MENU FILTERING DEBUG ===');
    console.log('Filtering menus. Assigned menus:', assignedMenus);
    console.log('All menu items:', allMenuItems);
    
    if (!assignedMenus || assignedMenus.length === 0) {
      console.log('No assigned menus found, showing only dashboard');
      return allMenuItems.filter(item => item.route === 'dashboard');
    }

    // Filter based on assigned menu IDs - use the correct property name from new model
    const assignedMenuIds = assignedMenus.map(menu => menu.menuId).filter(id => id !== null && id !== undefined);
    console.log('Assigned menu IDs from backend (filtered):', assignedMenuIds);
    console.log('Sample menu object structure:', assignedMenus[0]);
    
    // Create a map of menu IDs to menu items for easier lookup
    const menuMap = {};
    allMenuItems.forEach(item => {
      menuMap[item.id] = item;
    });
    
    console.log('Menu map:', menuMap);
    
    // Filter items based on assigned menu IDs
    const filteredItems = [];
    assignedMenuIds.forEach(menuId => {
      if (menuMap[menuId]) {
        filteredItems.push(menuMap[menuId]);
        console.log(`Added menu ${menuId}: ${menuMap[menuId].label}`);
      } else {
        console.log(`Menu ID ${menuId} not found in allMenuItems`);
      }
    });
    
    console.log('Final filtered menu items:', filteredItems);
    
    // Always include dashboard
    if (!filteredItems.find(item => item.route === 'dashboard')) {
      filteredItems.unshift(allMenuItems.find(item => item.route === 'dashboard'));
      console.log('Added dashboard to filtered items');
    }
    
    console.log('=== END MENU FILTERING DEBUG ===');
    return filteredItems;
  };

  const menuItems = getFilteredMenuItems();

  const renderContent = () => {
    // If children are provided, render them instead of the default content
    if (children) {
      return children;
    }

    // If no children, show dashboard with customers
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, color: '#228B22' }}>
          Welcome to Biomass Portal
        </Typography>
        
        {/* User Info Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#f0fff0', border: '1px solid #228B22' }}>
                <Typography variant="h6" sx={{ color: '#228B22', fontWeight: 600 }}>
                  Role
                </Typography>
                <Typography variant="body1" sx={{ color: '#006400', fontWeight: 500 }}>
                  {userRole ? `Role ${userRole}` : 'N/A'}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#f0fff0', border: '1px solid #228B22' }}>
                <Typography variant="h6" sx={{ color: '#228B22', fontWeight: 600 }}>
                  Customer Assignment
                </Typography>
                <Typography variant="body1" sx={{ color: '#006400', fontWeight: 500 }}>
                  {customerCount > 0 ? `${customerCount} Customer${customerCount > 1 ? 's' : ''}` : 'No Customer Assigned'}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#f0fff0', border: '1px solid #228B22' }}>
                <Typography variant="h6" sx={{ color: '#228B22', fontWeight: 600 }}>
                  Assigned Menus
                </Typography>
                <Typography variant="body1" sx={{ color: '#006400', fontWeight: 500 }}>
                  {assignedMenus.length > 0 ? `${assignedMenus.length} Menu${assignedMenus.length > 1 ? 's' : ''}` : 'No Menus Assigned'}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* DEBUG: Show assigned menus data */}
        {assignedMenus.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2, color: '#228B22' }}>
              Debug: Assigned Menus Data
            </Typography>
            <Card sx={{ p: 3, bgcolor: '#f8f8f8', border: '1px solid #ccc' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(assignedMenus, null, 2)}
              </Typography>
            </Card>
          </Box>
        )}

        {/* Customers Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2, color: '#228B22' }}>
            Your Customers ({customers.length})
          </Typography>
          
          {customers.length > 0 ? (
            <Grid container spacing={3}>
              {customers.map((customer) => (
                <Grid item xs={12} sm={6} md={4} key={customer.customerId}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        borderColor: '#228B22'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#228B22' }}>
                          {customer.firstName} {customer.lastName}
                        </Typography>
                        <Chip 
                          label={customer.status} 
                          size="small"
                          color={customer.status === 'active' ? 'success' : 'default'}
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                      
                      {customer.companyName && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Company:</strong> {customer.companyName}
                        </Typography>
                      )}
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {customer.email || 'N/A'}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Phone:</strong> {customer.phone || 'N/A'}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Location:</strong> {customer.city}, {customer.state}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Country:</strong> {customer.country}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Locations:</strong> {customer.locationCount || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#f0fff0', border: '1px solid #228B22' }}>
              <Typography variant="body1" sx={{ color: '#228B22' }}>
                No customers found. Please contact your administrator to assign customers to your account.
              </Typography>
            </Card>
          )}
        </Box>
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
            background: '#ffffff',
            color: '#228B22',
            borderRight: '1px solid #228B22',
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#228B22' }}>
            Biomass Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#228B22' }}>
              {user?.firstName?.charAt(0) || user?.userName?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="body2" sx={{ color: '#228B22' }}>
              {user?.firstName || user?.userName || 'User'}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ borderColor: '#228B22' }} />
        
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
                        <ListItemButton
            onClick={() => handleMenuClick(item.route)}
            sx={{
              mx: 1,
              borderRadius: 0,
              mb: 0.5,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(34, 139, 34, 0.2)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#228B22', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: 400,
                  color: '#228B22'
                } 
              }}
            />
          </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Divider sx={{ borderColor: '#228B22' }} />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ mx: 1, borderRadius: 0 }}>
              <ListItemIcon sx={{ color: '#228B22', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#228B22' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f8fffa', minHeight: '100vh' }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
