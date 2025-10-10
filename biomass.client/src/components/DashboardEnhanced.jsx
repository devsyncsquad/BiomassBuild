import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocalShipping as ShippingIcon,
  Scale as ScaleIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Storefront as StoreIcon,
  DirectionsCar as VehicleIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StatCard, Card } from '../theme/components';
import { colors, borderRadius } from '../theme/theme';

const DashboardEnhanced = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
    const role = localStorage.getItem('userRole') || 'User';
    setUserRole(role);

    // Get assigned menus from localStorage
    const assignedMenusData = localStorage.getItem('assignedMenus');
    if (assignedMenusData) {
      try {
        setAssignedMenus(JSON.parse(assignedMenusData));
      } catch (error) {
        console.error('Error parsing assigned menus data:', error);
      }
    }
  }, []);

  // Sample data for charts
  const weeklyData = [
    { name: 'Mon', dispatches: 12, weight: 45, cost: 1200 },
    { name: 'Tue', dispatches: 15, weight: 52, cost: 1400 },
    { name: 'Wed', dispatches: 18, weight: 61, cost: 1600 },
    { name: 'Thu', dispatches: 14, weight: 48, cost: 1300 },
    { name: 'Fri', dispatches: 22, weight: 75, cost: 1900 },
    { name: 'Sat', dispatches: 16, weight: 55, cost: 1500 },
    { name: 'Sun', dispatches: 10, weight: 38, cost: 1100 },
  ];

  const materialData = [
    { name: 'Wood Chips', value: 45, color: colors.primary.main },
    { name: 'Sawdust', value: 25, color: colors.success.main },
    { name: 'Bark', value: 20, color: colors.warning.main },
    { name: 'Other', value: 10, color: colors.info.main },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'dispatch',
      title: 'New dispatch created',
      description: 'Dispatch #DSP-2024-001 assigned to Vehicle V-001',
      time: '2 minutes ago',
      icon: <ShippingIcon />,
      color: colors.primary.main,
    },
    {
      id: 2,
      type: 'customer',
      title: 'Customer added',
      description: 'New customer "Green Energy Corp" registered',
      time: '15 minutes ago',
      icon: <PersonIcon />,
      color: colors.success.main,
    },
    {
      id: 3,
      type: 'vehicle',
      title: 'Vehicle maintenance',
      description: 'Vehicle V-003 scheduled for maintenance',
      time: '1 hour ago',
      icon: <VehicleIcon />,
      color: colors.warning.main,
    },
    {
      id: 4,
      type: 'vendor',
      title: 'Vendor payment',
      description: 'Payment processed for Vendor #VEN-001',
      time: '2 hours ago',
      icon: <MoneyIcon />,
      color: colors.info.main,
    },
  ];

  const kpiStats = [
    {
      title: "Today's Dispatches",
      value: 18,
      change: "+12%",
      changeType: "positive",
      variant: "primary",
      icon: <ShippingIcon />,
      subtitle: "vs yesterday",
    },
    {
      title: "Net Weight",
      value: 1250,
      change: "+8%",
      changeType: "positive",
      variant: "success",
      icon: <ScaleIcon />,
      subtitle: "tons delivered",
    },
    {
      title: "Loader Cost",
      value: 8500,
      change: "-3%",
      changeType: "negative",
      variant: "warning",
      icon: <MoneyIcon />,
      subtitle: "total cost",
    },
    {
      title: "Pending Collections",
      value: 5,
      change: "+2",
      changeType: "neutral",
      variant: "error",
      icon: <ScheduleIcon />,
      subtitle: "awaiting pickup",
    },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* Welcome Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: 'white',
          p: 4,
          mb: 3,
          borderRadius: '0 0 24px 24px',
          boxShadow: `0 8px 32px ${colors.primary.main}40`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(-50%, 50%)',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Welcome back!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontWeight: 300,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              Here's what's happening with your biomass operations today.
            </Typography>
          </Box>
        </Box>
      </Box>

      
    </Box>
  );
};

export default DashboardEnhanced;
