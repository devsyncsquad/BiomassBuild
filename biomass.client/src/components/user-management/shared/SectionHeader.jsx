import React from "react";
import { Box, Typography } from "@mui/material";

const SectionHeader = ({ title, subtitle, icon = null, mb = 3 }) => {
  return (
    <Box
      sx={{
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        mb,
        borderRadius: 2,
        p: 3,
        boxShadow: (theme) => `0 4px 20px ${theme.palette.primary.main}33`,
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant='h4'
            sx={{ fontWeight: 800, mb: subtitle ? 0.5 : 0 }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant='body1' sx={{ opacity: 0.95 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {icon}
      </Box>
    </Box>
  );
};

export default SectionHeader;
