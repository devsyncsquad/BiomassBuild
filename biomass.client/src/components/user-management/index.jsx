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
import AssignCostCenters from "./assignCostCenters";
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
    {
      label: "Assign Cost Centers",
      icon: <AssignmentIcon />,
      component: <AssignCostCenters />,
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
