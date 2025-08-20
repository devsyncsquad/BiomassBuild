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
import "./Dashboard.css";
import { logout, getUserRole, getUserCustomers } from "../utils/auth";

const DRAWER_WIDTH = 280;

const Dashboard = ({ user, onLogout, children }) => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    // Get customers from localStorage
    const customersData = localStorage.getItem("customers");
    if (customersData) {
      try {
        const parsedCustomers = JSON.parse(customersData);
        setCustomers(parsedCustomers);
        setCustomerCount(parsedCustomers.length);
      } catch (error) {
        console.error("Error parsing customers data:", error);
      }
    }

    // Get user role from localStorage
    const role = getUserRole();
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (menuId) => {
    if (children) {
      // If children are provided, navigate to the route
      switch (menuId) {
        case "dashboard":
          navigate("/");
          break;
        case "user-management":
          navigate("/user-management");
          break;
        case "company-management":
          navigate("/company-management");
          break;
        case "customer-management":
          navigate("/customer-management");
          break;
        case "vendor-management":
          navigate("/vendor-management");
          break;
        case "money-account":
          navigate("/money-account");
          break;
        case "lookup-management":
          navigate("/lookup-management");
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
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      color: "#667eea",
    },
    {
      id: "user-management",
      label: "User Management",
      icon: <PeopleIcon />,
      color: "#2196F3",
    },
    {
      id: "company-management",
      label: "Company Management",
      icon: <BusinessIcon />,
      color: "#FF9800",
    },
    {
      id: "customer-management",
      label: "Customer & Location Management",
      icon: <LocationOnIcon />,
      color: "#4CAF50",
    },
    {
      id: "vendor-management",
      label: "Vendor Management",
      icon: <StorefrontIcon />,
      color: "#9C27B0",
    },
    {
      id: "money-account",
      label: "Money Account",
      icon: <AccountBalanceIcon />,
      color: "#FF5722",
    },
    {
      id: "lookup-management",
      label: "LookUp Management",
      icon: <AccountBalanceIcon />,
      color: "#FF5722",
    },
  ];

  const renderContent = () => {
    // If children are provided, render them instead of the default content
    if (children) {
      return children;
    }

    // If no children, show dashboard with customers
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom sx={{ mb: 3, color: "#228B22" }}>
          Welcome to Biomass Portal
        </Typography>

        {/* User Info Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#f0fff0",
                  border: "1px solid #228B22",
                }}
              >
                <Typography
                  variant='h6'
                  sx={{ color: "#228B22", fontWeight: 600 }}
                >
                  Role
                </Typography>
                <Typography
                  variant='body1'
                  sx={{ color: "#006400", fontWeight: 500 }}
                >
                  {userRole ? `Role ${userRole}` : "N/A"}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#f0fff0",
                  border: "1px solid #228B22",
                }}
              >
                <Typography
                  variant='h6'
                  sx={{ color: "#228B22", fontWeight: 600 }}
                >
                  Customer Assignment
                </Typography>
                <Typography
                  variant='body1'
                  sx={{ color: "#006400", fontWeight: 500 }}
                >
                  {customerCount > 0
                    ? `${customerCount} Customer${customerCount > 1 ? "s" : ""}`
                    : "No Customer Assigned"}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Customers Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant='h5'
            gutterBottom
            sx={{ mb: 2, color: "#228B22" }}
          >
            Your Customers ({customers.length})
          </Typography>

          {customers.length > 0 ? (
            <Grid container spacing={3}>
              {customers.map((customer) => (
                <Grid item xs={12} sm={6} md={4} key={customer.customerId}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease-in-out",
                      border: "1px solid #e0e0e0",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                        borderColor: "#228B22",
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant='h6'
                          sx={{ fontWeight: 600, color: "#228B22" }}
                        >
                          {customer.firstName} {customer.lastName}
                        </Typography>
                        <Chip
                          label={customer.status}
                          size='small'
                          color={
                            customer.status === "active" ? "success" : "default"
                          }
                          sx={{ fontSize: "0.75rem" }}
                        />
                      </Box>

                      {customer.companyName && (
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 1 }}
                        >
                          <strong>Company:</strong> {customer.companyName}
                        </Typography>
                      )}

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        <strong>Email:</strong> {customer.email || "N/A"}
                      </Typography>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        <strong>Phone:</strong> {customer.phone || "N/A"}
                      </Typography>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        <strong>Location:</strong> {customer.city},{" "}
                        {customer.state}
                      </Typography>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        <strong>Country:</strong> {customer.country}
                      </Typography>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        <strong>Locations:</strong>{" "}
                        {customer.locationCount || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "#f0fff0",
                border: "1px solid #228B22",
              }}
            >
              <Typography variant='body1' sx={{ color: "#228B22" }}>
                No customers found. Please contact your administrator to assign
                customers to your account.
              </Typography>
            </Card>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant='permanent'
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            background: "#ffffff",
            color: "#228B22",
            borderRight: "1px solid #228B22",
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant='h5'
            sx={{ fontWeight: "bold", mb: 1, color: "#228B22" }}
          >
            Biomass Portal
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#228B22" }}>
              {user?.firstName?.charAt(0) || user?.userName?.charAt(0) || "U"}
            </Avatar>
            <Typography variant='body2' sx={{ color: "#228B22" }}>
              {user?.firstName || user?.userName || "User"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#228B22" }} />

        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 0,
                  mb: 0.5,
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(34, 139, 34, 0.2)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#228B22", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: 400,
                      color: "#228B22",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ borderColor: "#228B22" }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{ mx: 1, borderRadius: 0 }}
            >
              <ListItemIcon sx={{ color: "#228B22", minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary='Logout' sx={{ color: "#228B22" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component='main'
        sx={{ flexGrow: 1, bgcolor: "#f8fffa", minHeight: "100vh" }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
