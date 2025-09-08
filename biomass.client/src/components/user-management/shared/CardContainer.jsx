import React from "react";
import { Box } from "@mui/material";

const CardContainer = ({ children, p = 2, mb = 3 }) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: "background.paper",
        p,
        boxShadow: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        mb,
      }}
    >
      {children}
    </Box>
  );
};

export default CardContainer;
