import { useState, useEffect } from "react";

// MUI Imports
import { Grid, Box, Divider, Snackbar, Alert } from "@mui/material";
import CardContainer from "../shared/CardContainer";

// Component Imports
import AddUser from "./AddUser";
import ViewUsers from "./ViewUsers";

const Users = () => {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState({
    open: false,
    message: "",
    type: "success" // success, error, warning, info
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Function to handle successful user operations (add/edit/delete)
  const handleUserSuccess = (message) => {
    // Reset the form data after successful operation (only for add/edit)
    if (!message || !message.includes('deleted') && !message.includes('deactivated')) {
      setUserData(null);
    }
    // Trigger ViewUsers refresh for all operations
    setRefreshTrigger(prev => prev + 1);
    // Show success notification
    showNotification(message || "Operation completed successfully!", "success");
  };

  // Function to handle errors
  const handleError = (message) => {
    showNotification(message || "An error occurred!", "error");
  };

  // Function to show notifications
  const showNotification = (message, type = "success") => {
    setNotifications({
      open: true,
      message,
      type
    });
  };

  // Function to close notifications
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotifications(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Single form component that handles both Add and Edit */}
          <AddUser 
            userData={userData} 
            setUserData={setUserData} 
            onSuccess={handleUserSuccess}
            onError={handleError}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ width: "100%", my: 1 }} />
        </Grid>
        <Grid item xs={12}>
          {/* ViewUsers component - only shows the list and passes edit requests to parent */}
          <ViewUsers 
            setUserData={setUserData} 
            onError={handleError}
            onSuccess={handleUserSuccess}
            refreshTrigger={refreshTrigger}
          />
        </Grid>
      </Grid>

      {/* Toast Notifications */}
      <Snackbar
        open={notifications.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notifications.type}
          sx={{ width: '100%' }}
        >
          {notifications.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default Users;
