import React, { useState } from "react";
import { Box, Grid, Divider } from "@mui/material";
import CardContainer from "../shared/CardContainer";

import AddRole from "./AddRole";
import ViewRoles from "./ViewRoles";

const Roles = () => {
  const [initialData, setInitialData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <CardContainer> */}
          <AddRole initialData={initialData} />
          {/* </CardContainer> */}
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ width: "100%", my: 1 }} />
        </Grid>
        <Grid item xs={12}>
          {/* <CardContainer> */}
          <ViewRoles setInitialData={setInitialData} />
          {/* </CardContainer> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Roles;
