import React from 'react';
import { useState } from 'react';
import { Divider, Grid, Box, Tabs } from '@mui/material';
import Tab from '@mui/material/Tab';

import AddMainMenu from './AddMainMenu';
import AddSubMenu from './AddSubMenu';
import ViewMainMenus from './ViewMainMenus';
import ViewSubMenus from './ViewSubMenus';

const AddMenu = () => {
  const [activeTab, setActiveTab] = useState('addMainMenu');
  const [mainMenuData, setMainMenuData] = useState(null);
  const [subMenuData, setSubMenuData] = useState(null);
   const [selectedMainMenu, setSelectedMainMenu] = useState('');

  const handleTabChange = (event, value) => {
    setActiveTab(value);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Add Menu Tabs">
            <Tab label="Add Main Menu" value="addMainMenu" />
            <Tab label="Add Sub Menu" value="addSubMenu" />
          </Tabs>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          {activeTab === 'addMainMenu' && (
            <Box>
              <AddMainMenu mainMenuData={mainMenuData} />
              <Divider color="#7F40A8" sx={{ height: 1, width: '100%', my: 5 }} />
              <ViewMainMenus setMainMenuData={setMainMenuData} />
            </Box>
          )}
          {activeTab === 'addSubMenu' && (
            <Box>
              <AddSubMenu subMenuData={subMenuData} selectedMainMenu={selectedMainMenu} />
              <Divider color="#7F40A8" sx={{ height: 1, width: '100%', my: 5 }} />
              <ViewSubMenus setSubMenuData={setSubMenuData} selectedMainMenu={selectedMainMenu} setSelectedMainMenu={setSelectedMainMenu} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default AddMenu;
