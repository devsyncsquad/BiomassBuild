import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { colors, borderRadius, shadows } from '../theme';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  backgroundColor: colors.background.paper,
  borderRadius: borderRadius.lg,
  boxShadow: shadows.base,
  
  '& .MuiDataGrid-root': {
    border: 'none',
  },
  
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${colors.gray[200]}`,
    padding: '12px 16px',
  },
  
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: colors.gray[50],
    borderBottom: `2px solid ${colors.gray[200]}`,
    '& .MuiDataGrid-columnHeader': {
      borderRight: `1px solid ${colors.gray[200]}`,
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
  
  '& .MuiDataGrid-row': {
    '&:hover': {
      backgroundColor: colors.primary[50],
    },
    '&.Mui-selected': {
      backgroundColor: colors.primary[100],
      '&:hover': {
        backgroundColor: colors.primary[200],
      },
    },
  },
  
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${colors.gray[200]}`,
    backgroundColor: colors.gray[50],
  },
  
  '& .MuiDataGrid-toolbarContainer': {
    padding: '16px',
    borderBottom: `1px solid ${colors.gray[200]}`,
    backgroundColor: colors.background.paper,
  },
}));

const TableHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px 24px 16px 24px',
  borderBottom: `1px solid ${colors.gray[200]}`,
  backgroundColor: colors.background.paper,
  borderRadius: `${borderRadius.lg} ${borderRadius.lg} 0 0`,
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 24px',
  borderBottom: `1px solid ${colors.gray[200]}`,
  backgroundColor: colors.gray[50],
  flexWrap: 'wrap',
}));

const ActionButton = styled(IconButton)(({ theme, variant }) => ({
  width: '32px',
  height: '32px',
  '&:hover': {
    backgroundColor: variant === 'danger' ? colors.error[50] : colors.primary[50],
  },
}));

const CustomToolbar = ({ onAdd, onRefresh, onExport, filters, onFilterChange }) => {
  return (
    <GridToolbarContainer sx={{ padding: '16px', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            size="small"
          >
            Add New
          </Button>
        )}
        
        {onRefresh && (
          <IconButton onClick={onRefresh} size="small">
            <RefreshIcon />
          </IconButton>
        )}
        
        {onExport && (
          <IconButton onClick={onExport} size="small">
            <DownloadIcon />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>
    </GridToolbarContainer>
  );
};

const DataTable = ({
  title,
  data,
  columns,
  loading = false,
  onAdd,
  onRefresh,
  onExport,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onPrint,
  filters = [],
  onFilterChange,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  getRowId = (row) => row.id,
  ...props
}) => {
  const [filterValues, setFilterValues] = useState({});

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filterValues, [filterName]: value };
    setFilterValues(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const enhancedColumns = useMemo(() => {
    const baseColumns = columns.map(col => ({
      ...col,
      flex: col.flex || 1,
      minWidth: col.minWidth || 150,
    }));

    // Add action column if any action handlers are provided
    if (onView || onEdit || onDelete || onPrint) {
      baseColumns.push({
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        width: 120,
        getActions: (params) => {
          const actions = [];
          
          if (onView) {
            actions.push(
              <Tooltip title="View" key="view">
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(params.row);
                  }}
                >
                  <ViewIcon fontSize="small" />
                </ActionButton>
              </Tooltip>
            );
          }
          
          if (onEdit) {
            actions.push(
              <Tooltip title="Edit" key="edit">
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(params.row);
                  }}
                >
                  <EditIcon fontSize="small" />
                </ActionButton>
              </Tooltip>
            );
          }
          
          if (onPrint) {
            actions.push(
              <Tooltip title="Print" key="print">
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrint(params.row);
                  }}
                >
                  <PrintIcon fontSize="small" />
                </ActionButton>
              </Tooltip>
            );
          }
          
          if (onDelete) {
            actions.push(
              <Tooltip title="Delete" key="delete">
                <ActionButton
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(params.row);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </ActionButton>
              </Tooltip>
            );
          }
          
          return actions;
        },
      });
    }

    return baseColumns;
  }, [columns, onView, onEdit, onDelete, onPrint]);

  const filteredData = useMemo(() => {
    if (!filters.length || Object.keys(filterValues).length === 0) {
      return data;
    }

    return data.filter(row => {
      return filters.every(filter => {
        const value = filterValues[filter.field];
        if (!value) return true;
        
        const cellValue = row[filter.field];
        if (filter.type === 'select') {
          return cellValue === value;
        }
        if (filter.type === 'text') {
          return cellValue?.toString().toLowerCase().includes(value.toLowerCase());
        }
        return true;
      });
    });
  }, [data, filters, filterValues]);

  return (
    <Paper sx={{ borderRadius: borderRadius.lg, overflow: 'hidden' }}>
      {/* Table Header */}
      <TableHeader>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              size="small"
            >
              Add New
            </Button>
          )}
          
          {onRefresh && (
            <IconButton onClick={onRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          )}
          
          {onExport && (
            <IconButton onClick={onExport} size="small">
              <DownloadIcon />
            </IconButton>
          )}
        </Box>
      </TableHeader>

      {/* Filters */}
      {filters.length > 0 && (
        <FiltersContainer>
          {filters.map((filter) => (
            <FormControl key={filter.field} size="small" sx={{ minWidth: 200 }}>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={filterValues[filter.field] || ''}
                onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                label={filter.label}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All {filter.label}</em>
                </MenuItem>
                {filter.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </FiltersContainer>
      )}

      {/* Data Grid */}
      <StyledDataGrid
        rows={filteredData}
        columns={enhancedColumns}
        loading={loading}
        getRowId={getRowId}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        pagination
        paginationMode="client"
        sortingMode="client"
        filterMode="client"
        disableRowSelectionOnClick
        onRowClick={onRowClick}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            onAdd,
            onRefresh,
            onExport,
            filters,
            onFilterChange,
          },
        }}
        sx={{
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.background.paper,
          },
        }}
        {...props}
      />
    </Paper>
  );
};

export default DataTable;
