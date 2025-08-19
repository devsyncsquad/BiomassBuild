import React, { useState } from 'react';
import { Box, Grid, Divider } from '@mui/material';

import AddRole from './AddRole';
import ViewRoles from './ViewRoles';

const Roles = () => {
  const [initialData, setInitialData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <AddRole initialData={initialData} />
        </Grid>
        <Grid item xs={12}>
          <Divider color="#228B22" sx={{ width: '100%', my: 2 }} />
        </Grid>
        <Grid item xs={12}>
          <ViewRoles setInitialData={setInitialData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Roles;
