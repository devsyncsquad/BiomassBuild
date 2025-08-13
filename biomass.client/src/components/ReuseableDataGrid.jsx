import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import * as XLSX from 'xlsx';

const ReuseableDataGrid = ({
  iColumns = [],
  initialRows = [],
  deleteApi = '',
  deleteBy = 'id',
  setInitialData,
  refetch,
  showExportToolbarOption = false,
  fileName = 'data',
  checkboxSelection = false,
  height = 400,
  onRowClick,
  showActions = false,
  onEdit,
  onView,
  onDelete,
  loading = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  ...otherProps
}) => {
  const [rows, setRows] = useState(initialRows);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const handleDelete = (id) => {
    setSelectedRow(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (onDelete) {
        await onDelete(selectedRow);
      } else if (deleteApi) {
        // Handle API delete if provided
        console.log('Delete API call would go here:', deleteApi, selectedRow);
      }
      
      // Remove from local state
      const updatedRows = rows.filter(row => row[deleteBy] !== selectedRow);
      setRows(updatedRows);
      
      // Update parent state if callback provided
      if (setInitialData) {
        setInitialData(updatedRows);
      }
      
      // Refetch if callback provided
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error('Error deleting row:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedRow(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const handleExport = () => {
    const exportData = rows.map(row => {
      const exportRow = {};
      iColumns.forEach(col => {
        if (col.field && col.field !== 'actions') {
          exportRow[col.headerName || col.field] = row[col.field];
        }
      });
      return exportRow;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // Add action column if showActions is true
  const columns = [...iColumns];
  
  if (showActions) {
    columns.push({
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onView && (
            <Tooltip title="View">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(params.row);
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(params.row);
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {(onDelete || deleteApi) && (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(params.row[deleteBy]);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    });
  }

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexGrow: 1 }}>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          {showExportToolbarOption && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleExport}
              sx={{ ml: 'auto' }}
            >
              Export to Excel
            </Button>
          )}
        </Box>
      </GridToolbarContainer>
    );
  };

  return (
    <Box sx={{ height, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        onRowClick={onRowClick}
        pageSizeOptions={pageSizeOptions}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize },
          },
        }}
        slots={{
          toolbar: showExportToolbarOption ? CustomToolbar : GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        disableRowSelectionOnClick={showActions}
        {...otherProps}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReuseableDataGrid; 