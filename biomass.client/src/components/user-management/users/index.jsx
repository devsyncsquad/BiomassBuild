import { useState } from 'react';

// MUI Imports
import { Card, CardContent, Grid, Divider, Box } from '@mui/material';

// Component Imports
import AddUser from './AddUser';
import ViewUsers from './ViewUsers';

const Users = () => {
  const [userData, setUserData] = useState(null);
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <AddUser userData={userData} setUserData={setUserData} />
        </Grid>
        <Grid item xs={12}>
          <Divider color="#7F40A8" sx={{ width: '100%', my: 2 }} />
        </Grid>
        <Grid item xs={12}>
          <ViewUsers setUserData={setUserData} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Users;
