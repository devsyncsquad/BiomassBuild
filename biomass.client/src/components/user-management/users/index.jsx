import { useState } from 'react';

// MUI Imports
import { Card, CardContent, Grid, Box } from '@mui/material';

// Component Imports
import AddUser from './AddUser';
import ViewUsers from './ViewUsers';

const Users = () => {
  const [userData, setUserData] = useState(null);
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AddUser userData={userData} setUserData={setUserData} />
        </Grid>
        <Grid item xs={12}>
          <ViewUsers setUserData={setUserData} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Users;
