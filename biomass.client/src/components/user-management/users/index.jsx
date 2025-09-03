import { useState } from "react";

// MUI Imports
import { Grid, Box, Divider } from "@mui/material";
import CardContainer from "../shared/CardContainer";

// Component Imports
import AddUser from "./AddUser";
import ViewUsers from "./ViewUsers";

const Users = () => {
  const [userData, setUserData] = useState(null);
  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <CardContainer> */}
          <AddUser userData={userData} setUserData={setUserData} />
          {/* </CardContainer> */}
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ width: "100%", my: 1 }} />
        </Grid>
        <Grid item xs={12}>
          {/* <CardContainer> */}
          <ViewUsers setUserData={setUserData} />
          {/* </CardContainer> */}
        </Grid>
      </Grid>
    </Box>
  );
};
export default Users;
