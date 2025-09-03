// React Imports
import React, { useState } from "react";

// MUI Imports
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import {
  People as PeopleIcon,
  Security as SecurityIcon,
  Menu as MenuIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

// Component Imports
import Users from "./users";
import Roles from "./roles";
import Menus from "./addMenu";
import AssignMenus from "./assignMenus";
import SectionHeader from "./shared/SectionHeader";
import userManagementTheme from "./theme";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: "Users", icon: <PeopleIcon />, component: <Users /> },
    { label: "Roles", icon: <SecurityIcon />, component: <Roles /> },
    { label: "Menus", icon: <MenuIcon />, component: <Menus /> },
    {
      label: "Assign Menus",
      icon: <AssignmentIcon />,
      component: <AssignMenus />,
    },
    // { label: "Companies", icon: <BusinessIcon />, component: <Companies /> },
  ];

  return (
    <ThemeProvider theme={userManagementTheme}>
      <Box
        sx={{
          width: "100%",
          p: 0,
          // minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
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
                User Management
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* <SectionHeader title='User Management' /> */}

        {/* Tabs Section */}
        <Box sx={{ px: 3, mb: 3 }}>
          <Paper
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 2,
              border: 1,
              borderColor: "divider",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant='scrollable'
              scrollButtons='auto'
              sx={{
                "& .MuiTab-root": {
                  minHeight: 64,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "none",
                  "&.Mui-selected": {
                    color: "primary.main",
                    fontWeight: 700,
                  },
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          color:
                            activeTab === index ? "primary.main" : "#6B7280",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {tab.icon}
                      </Box>
                      {tab.label}
                    </Box>
                  }
                  sx={{ minHeight: 64, px: 3 }}
                />
              ))}
            </Tabs>
          </Paper>
        </Box>

        {/* Content Section */}
        <Box sx={{ px: 3, pb: 6 }}>
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 2,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            {tabs[activeTab].component}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UserManagement;
