import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Badge,
  Breadcrumbs,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Storefront as StoreIcon,
  AccountBalance as AccountIcon,
  AccountTree as CostCenterIcon,
  DirectionsCar as VehicleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { colors, borderRadius, shadows } from '../theme';

const DRAWER_WIDTH = 280;

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    backgroundColor: colors.background.sidebar,
    borderRight: 'none',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme, open }) => ({
  backgroundColor: colors.background.paper,
  color: colors.text.primary,
  boxShadow: shadows.sm,
  borderBottom: `1px solid ${colors.gray[200]}`,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: '48px',
  padding: '0 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  margin: '4px 12px',
  borderRadius: borderRadius.md,
  color: active ? colors.primary.main : colors.text.inverse,
  backgroundColor: active ? colors.primary[50] : 'transparent',
  '&:hover': {
    backgroundColor: active ? colors.primary[100] : 'rgba(255, 255, 255, 0.08)',
  },
  '& .MuiListItemIcon-root': {
    color: active ? colors.primary.main : colors.text.inverse,
    minWidth: '40px',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 400,
    color: active ? colors.primary.main : colors.text.inverse,
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  opacity: 1,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  padding: '8px 16px',
  backgroundColor: colors.background.paper,
  borderBottom: `1px solid ${colors.gray[200]}`,
  minHeight: '40px',
  '& .MuiBreadcrumbs-ol': {
    alignItems: 'center',
  },
  '& .MuiBreadcrumbs-li': {
    '& .MuiLink-root': {
      color: colors.text.secondary,
      textDecoration: 'none',
      fontSize: '0.875rem',
      '&:hover': {
        color: colors.primary.main,
      },
    },
    '&:last-child .MuiLink-root': {
      color: colors.text.primary,
      fontWeight: 600,
    },
  },
}));

const MainContent = styled(Box)(({ theme, open }) => ({
  flexGrow: 1,
  padding: '24px',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    marginLeft: 0, // No extra margin when sidebar is open
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'User Management', icon: <PeopleIcon />, path: '/user-management' },
  { text: 'Company Management', icon: <BusinessIcon />, path: '/company-management' },
  { text: 'Customer Management', icon: <PeopleIcon />, path: '/customer-management' },
  { text: 'Customer Locations', icon: <LocationIcon />, path: '/customer-locations' },
  { text: 'Vendor Management', icon: <StoreIcon />, path: '/vendor-management' },
  { text: 'Vehicle Management', icon: <VehicleIcon />, path: '/vehicle-management' },
  { text: 'Money Account', icon: <AccountIcon />, path: '/money-account' },
  { text: 'Cost Centers', icon: <CostCenterIcon />, path: '/cost-centers' },
  { text: 'Lookup', icon: <SettingsIcon />, path: '/lookup-management' },
];

const AppLayout = ({ children, user, onLogout }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const getBreadcrumbs = () => {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [{ text: 'Home', path: '/', icon: <HomeIcon /> }];
    
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const text = segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      breadcrumbs.push({ text, path });
    });
    
    return breadcrumbs;
  };

  const isActivePath = (path) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
             <StyledDrawer
         variant={isMobile ? 'temporary' : 'persistent'}
         open={open}
         onClose={handleDrawerToggle}
       >
                 {/* Sidebar Header */}
         <Box sx={{ 
           p: 2, 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'center',
           borderBottom: `1px solid ${colors.background.sidebarDark}`,
           minHeight: '64px'
         }}>
           <Typography variant="h6" sx={{ color: colors.text.inverse, fontWeight: 600 }}>
             BiomassPro
           </Typography>
         </Box>

        {/* Navigation Menu */}
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
                             <StyledListItemButton
                 active={isActivePath(item.path)}
                 onClick={() => handleNavigation(item.path)}
               >
                <ListItemIcon>{item.icon}</ListItemIcon>
                                 <StyledListItemText 
                   primary={item.text} 
                 />
              </StyledListItemButton>
            </ListItem>
          ))}
        </List>

                 {/* User Section */}
         <Divider sx={{ borderColor: colors.background.sidebarDark, my: 2 }} />
         <Box sx={{ p: 2 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
             
             
           </Box>
         </Box>
      </StyledDrawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
                 <StyledAppBar position="fixed" open={open}>
          <StyledToolbar>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* User Avatar */}
              <IconButton color="inherit" onClick={onLogout}>
                <Avatar 
                  sx={{ 
                    width: 28, 
                    height: 28, 
                    bgcolor: colors.primary.main,
                    fontSize: '0.75rem'
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Box>
          </StyledToolbar>

                     {/* Breadcrumbs */}
           <StyledBreadcrumbs>
             {getBreadcrumbs().map((breadcrumb, index) => (
               <Link
                 key={breadcrumb.path}
                 component="button"
                 onClick={() => handleNavigation(breadcrumb.path)}
                 underline="hover"
                 sx={{ display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
               >
                 {breadcrumb.icon && <Box component="span" sx={{ mr: 0.5 }}>{breadcrumb.icon}</Box>}
                 {breadcrumb.text}
               </Link>
             ))}
           </StyledBreadcrumbs>
        </StyledAppBar>

        {/* Main Content Area */}
                 <MainContent open={open}>
          <Box sx={{ mt: '88px' }}> {/* Account for fixed topbar + breadcrumbs (48px + 40px) */}
            {children}
          </Box>
        </MainContent>
      </Box>
    </Box>
  );
};

export default AppLayout;
