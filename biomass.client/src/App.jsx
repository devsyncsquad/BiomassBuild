import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Dashboard from "./components/Dashboard";
import DashboardEnhanced from "./components/DashboardEnhanced";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CompanyManagement from "./components/CompanyManagement";
import CustomerManagement from "./components/CustomerManagement";
import CustomerLocations from "./components/CustomerLocations";
import VendorManagement from "./components/VendorManagement";
import VehicleManagement from "./components/vehicle-management/VehicleManagement";
import UserManagement from "./components/user-management";
import MoneyAccount from "./components/MoneyAccount";
import CostCenters from "./components/CostCenters";
import Employees from "./components/Employees";
import Lookup from "./components/lookup/Lookup";
import "./App.css";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { isAuthenticated, getCurrentUser, logout } from "./utils/auth";
import { theme, AppLayout } from "./theme/components";

// Using Vuexy-inspired theme from design system

// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }
  return children;
};

// Layout component that wraps content with AppLayout
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
    window.location.href = "/login";
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      {children}
    </AppLayout>
  );
};

// DashboardHome component for the main dashboard view
const DashboardHome = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: "Total Users",
      value: "10",
      icon: "👥",
      color: "#2196F3",
    },
    {
      title: "Active Roles",
      value: "8",
      icon: "🔐",
      color: "#4CAF50",
    },
    {
      title: "Companies",
      value: "04",
      icon: "🏢",
      color: "#FF9800",
    },
    {
      title: "Customers",
      value: "8",
      icon: "👤",
      color: "#9C27B0",
    },
    {
      title: "Vendors",
      value: "28",
      icon: "🏪",
      color: "#E91E63",
    },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* <Typography variant='h4' gutterBottom sx={{ p: 3, pb: 1 }}>
        Dashboard Overview
      </Typography> */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
          color: "white",
          p: 4,
          mb: 3,
          borderRadius: "0 0 24px 24px",
          boxShadow: "0 8px 32px rgba(34,139,34,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "150px",
            height: "150px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(-50%, 50%)",
          }}
        />

        <Box
          sx={{
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              variant='h4'
              gutterBottom
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 1,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Dashboard
            </Typography>
            {/* <Typography
              variant='h6'
              sx={{
                color: "white",
                opacity: 0.9,
                fontWeight: 300,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              Manage your vendor relationships, track performance, and
              streamline procurement processes.
            </Typography> */}
          </Box>
          {/* <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleAddVendor}
            size='large'
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              "&:hover": {
                background: "rgba(255,255,255,0.3)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add New Vendor
          </Button> */}
        </Box>
      </Box>
      <Grid container spacing={3} sx={{ mb: 4, px: 3 }}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                background: `linear-gradient(135deg, ${item.color}15, ${item.color}25)`,
                border: `1px solid ${item.color}30`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant='h4'
                      component='div'
                      sx={{ fontWeight: "bold", color: item.color }}
                    >
                      {item.value}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant='h3' sx={{ opacity: 0.7 }}>
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
              <Typography variant='h6' gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#4CAF50",
                    }}
                  />
                  <Typography variant='body2'>
                    New customer registered: John Doe
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ ml: "auto" }}
                  >
                    2 min ago
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#2196F3",
                    }}
                  />
                  <Typography variant='body2'>
                    Role updated: Administrator
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ ml: "auto" }}
                  >
                    15 min ago
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#FF9800",
                    }}
                  />
                  <Typography variant='body2'>
                    Company added: Tech Corp
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ ml: "auto" }}
                  >
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
              <Typography variant='h6' gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant='outlined'
                  fullWidth
                  onClick={() => navigate("/user-management")}
                >
                  Manage Users
                </Button>
                <Button
                  variant='outlined'
                  fullWidth
                  onClick={() => navigate("/company-management")}
                >
                  Manage Companies
                </Button>
                <Button
                  variant='outlined'
                  fullWidth
                  onClick={() => navigate("/customer-management")}
                >
                  Manage Customers
                </Button>
                <Button
                  variant='outlined'
                  fullWidth
                  onClick={() => navigate("/vendor-management")}
                >
                  Manage Vendors
                </Button>
                <Button
                  variant='outlined'
                  fullWidth
                  onClick={() => navigate("/cost-centers")}
                >
                  Manage Cost Centers
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
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
            {/* Public routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />

            {/* Protected routes with Dashboard layout */}
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardEnhanced />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/company-management'
              element={
                <ProtectedRoute>
                  <Layout>
                    <CompanyManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/customer-management'
              element={
                <ProtectedRoute>
                  <Layout>
                    <CustomerManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/customer-locations'
              element={
                <ProtectedRoute>
                  <Layout>
                    <CustomerLocations />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/vendor-management'
              element={
                <ProtectedRoute>
                  <Layout>
                    <VendorManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/user-management'
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/money-account'
              element={
                <ProtectedRoute>
                  <Layout>
                    <MoneyAccount />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/cost-centers'
              element={
                <ProtectedRoute>
                  <Layout>
                    <CostCenters />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/lookup-management'
              element={
                <ProtectedRoute>
                  <Layout>
                    <Lookup />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/vehicle-management'
              element={
                <ProtectedRoute>
                  <Layout>
                    <VehicleManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path='/employees'
              element={
                <ProtectedRoute>
                  <Layout>
                    <Employees />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
    </Provider>
  );
}

export default App;
