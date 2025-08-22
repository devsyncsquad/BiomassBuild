import React from 'react';
import { useState, useCallback } from 'react';
import { Divider, Grid, Box } from '@mui/material';

import AddMenu from './AddMainMenu';
import ViewMenus from './ViewMainMenus';

const MenuManagement = () => {
  const [menuData, setMenuData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to trigger refresh of menu list
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <AddMenu 
            menuData={menuData} 
            onMenuSaved={(savedMenu) => {
              setMenuData(null); // Clear edit mode
              handleRefresh(); // Refresh the list
            }}
            onRefresh={handleRefresh}
          />
        </Box>
        
        <Divider color="#228B22" sx={{ height: 2, width: '100%', my: 3 }} />
        
        <Box sx={{ mt: 2 }}>
          <ViewMenus 
            key={refreshKey}
            setMenuData={setMenuData} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MenuManagement;
