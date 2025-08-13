// React Imports
import React, { useState, useEffect } from 'react';

// Other Imports
import axios from 'axios';

// MUI Imports
import {
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  MenuItem,
  Typography,
  Divider,
  Select,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

// Reuseable Component Imports
import ReuseableDataGrid from '@/components/ReuseableDataGrid';

// Component Imports
import {
  useGetMainMenuListQuery,
  useGetSubMenuListByMainMenuQuery,
  useGetSubMenuByMainMenuIdListQuery
} from '../../../redux/apis/userManagementApi';
const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';

const ViewSubMenus = ({
  setSubMenuData,
  selectedMainMenu,
  setSelectedMainMenu
}) => {
  const [mainMenus, setMainMenus] = useState([]);
  const [subMenus, setSubMenus] = useState([]);
  // const [selectedMainMenu, setSelectedMainMenu] = useState('');
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [selectedSubMenuId, setSelectedSubMenuId] = useState(null);

  const {
    data: mainMenusData,
    error,
    isLoading: isMainMenusDataLoading,
    refetch: refetchMainMenus
  } = useGetMainMenuListQuery();

  const {
    data: subMenusData,
    isLoading: isSubMenusDataLoading,
    refetch: refetchSubMenus
  } = useGetSubMenuByMainMenuIdListQuery(selectedMainMenu, {
    skip: !selectedMainMenu
  });

  useEffect(() => {
    if (mainMenusData) {
      setMainMenus(mainMenusData?.result);
    }
  }, [mainMenusData]);

  useEffect(() => {
    if (subMenusData) {
      const subMenuList = subMenusData.result?.map((subMenu, index) => ({
        id: index + 1,
        subMenuId: subMenu.subMenuId,
        subMenuDesc: subMenu.subMenuDesc,
        link: subMenu.link,
        icon: subMenu.icon,
        mainMenuId: subMenu.mainMenuId,
        orderNo: subMenu.orderNo,
        // enabled: subMenu.enabled === 'Y' ? 'Yes' : 'No',
        enabled: subMenu.enabled,
        createdBy: subMenu.createdBy,
        createdDate: subMenu.createdOn
      }));
      setSubMenus(subMenuList);
    }
  }, [subMenusData]);

  // const getMainMenus = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `${baseUrl}UserManagement/GetMainMenuList`
  //     );
  //     setMainMenus(data.result);
  //   } catch (error) {
  //     console.error('Error fetching main menus:', error);
  //   }
  // };

  // const getSubMenus = async (mainMenuId) => {
  //   try {
  //     const { data } = await axios.get(
  //       `${baseUrl}UserManagement/GetSubMenuList`
  //     );
  //     console.log('Sub menus ===============', data);
  //     const subMenuList = data.result.map((subMenu, index) => ({
  //       id: index + 1,
  //       subMenuId: subMenu.subMenuId,
  //       subMenuDesc: subMenu.subMenuDesc,
  //       link: subMenu.link,
  //       icon: subMenu.icon,
  //       mainMenuId: subMenu.mainMenuId,
  //       orderNo: subMenu.orderNo,
  //       enabled: subMenu.enabled === 'Y' ? 'Yes' : 'No',
  //       createdBy: subMenu.createdBy,
  //       createdDate: subMenu.createdOn
  //     }));
  //     setSubMenus(subMenuList);
  //   } catch (error) {
  //     console.error('Error fetching sub menus:', error);
  //   }
  // };

  // useEffect(() => {
  //   getMainMenus();
  // }, []);

  const handleSelectedMainMenu = (mainMenuId) => {
    setSelectedMainMenu(mainMenuId);
    // getSubMenus(mainMenuId);
  };

  // useEffect(() => {
  //   if (selectedMainMenu) {
  //     getSubMenus(selectedMainMenu)
  //   } else {
  //     setSubMenus([])
  //   }
  // }, [selectedMainMenu])

  const handleDelete = (id) => {
    setSelectedSubMenuId(id);
    setOpenDeleteModel(true);
  };

  const handleDeleteModelClose = () => {
    setOpenDeleteModel(false);
    setSelectedSubMenuId(null);
  };

  const handleDeleteModelAgree = async () => {
    try {
      await axios.delete('');
      setSubMenus((prevRows) =>
        prevRows.filter((row) => row.id !== selectedSubMenuId)
      );
    } catch (error) {
      console.error('Error deleting sub menu:', error);
    }
    handleDeleteModelClose();
  };

  const dataGridColumns = [
    { field: 'id', headerName: 'Sr.', width: 5, flex: 0.2 },
    {
      field: 'subMenuDesc',
      headerName: 'Sub Menu Description',
      width: 250,
      flex: 2
    },
    { field: 'link', headerName: 'Link', width: 150, flex: 1 },
    { field: 'icon', headerName: 'Icon', width: 100, flex: 1 },
    { field: 'mainMenuId', headerName: 'Main Menu Id', width: 120, flex: 1 },
    { field: 'orderNo', headerName: 'Order No', width: 100, flex: 1 },
    {
      field: 'enabled',
      headerName: 'Enabled',
      width: 100,
      flex: 1,
      renderCell: (params) => (params.value === 'Y' ? 'Yes' : 'No')
    },
    { field: 'createdBy', headerName: 'Created By', width: 150, flex: 1 },
    { field: 'createdOn', headerName: 'Created On', width: 150, flex: 1 }
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   width: 150,
    //   renderCell: params => (
    //     <div>
    //       <Button color='error' onClick={() => handleDelete(params.row.id)}>
    //         <i className='ri-delete-bin-6-line'></i>
    //       </Button>
    //     </div>
    //   )
    // }
  ];

  return (
    <Card sx={{ p: 0 }}>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        spacing={1}
      >
        <Grid item>
          <Typography variant="h5" align="left" sx={{ color: '#8E48BB' }}>
            View Sub Menus
          </Typography>
        </Grid>
      </Grid>
      <Divider color="#8E48BB" sx={{ mb: 1, height: 1 }} />
      {/* <CardHeader
        title="View Sub Menus"
        titleTypographyProps={{
          style: { color: '#7F40A8', marginInline: '0.5rem' }
        }}
      /> */}

      <Grid container spacing={2} sx={{ my: 3 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Main Menu</InputLabel>
            <Select
              label="Main Menu"
              value={selectedMainMenu}
              onChange={(e) => handleSelectedMainMenu(e.target.value)}
            >
              {mainMenus.map((menu) => (
                <MenuItem key={menu.mainMenuId} value={menu.mainMenuId}>
                  {menu.mainMenuDesc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        width="Inherit"
        // sx={{ paddingBottom: 8, paddingX: 8 }}
      >
        <Grid item xs={12} sm={12}>
          <ReuseableDataGrid
            iColumns={dataGridColumns}
            initialRows={subMenus}
            deleteApi=""
            deleteBy="id"
            setInitialData={setSubMenuData}
            refetch={refetchSubMenus}
            showExportToolbarOption
            fileName="Sub Menus"
            // fileName='users.xlsx'
            // checkboxSelection
            // height={500}
          />
        </Grid>
      </Grid>

      <Dialog
        open={openDeleteModel}
        onClose={handleDeleteModelClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteModelClose}>Disagree</Button>
          <Button onClick={handleDeleteModelAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ViewSubMenus;
