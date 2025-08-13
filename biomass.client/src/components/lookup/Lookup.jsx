import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import { lookupApi } from '../../utils/lookupApi';

const Lookup = () => {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0); // zero-based for DataGrid
  const [pageSize, setPageSize] = useState(10);
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ look_up_name: '', look_up_domain: '', enabled: 'Y' });
  const [edit, setEdit] = useState(null); // {id, look_up_name, look_up_domain, enabled}
  const [confirmDelete, setConfirmDelete] = useState(null); // id

  const columns = useMemo(() => [
    { field: 'lookUpId', headerName: 'ID', width: 90 },
    { field: 'lookUpName', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'lookUpDomain', headerName: 'Domain', width: 160 },
    { field: 'enabled', headerName: 'Enabled', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => setEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setConfirmDelete(params.row.lookUpId)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ], []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await lookupApi.getLookups({ domain, page: page + 1, pageSize });
      const { items, totalCount, item1, item2 } = res.result || res.Result || {};
      const list = items || item1 || [];
      const total = (typeof totalCount === 'number' ? totalCount : item2) || 0;
      setRows(list.map(x => ({
        id: x.lookUpId ?? x.LookUpId,
        lookUpId: x.lookUpId ?? x.LookUpId,
        lookUpName: x.lookUpName ?? x.LookUpName,
        lookUpDomain: x.lookUpDomain ?? x.LookUpDomain,
        enabled: x.enabled ?? x.Enabled,
      })));
      setRowCount(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [domain, page, pageSize]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await lookupApi.create({
        lookUpName: form.look_up_name,
        lookUpDomain: form.look_up_domain,
        enabled: form.enabled,
      });
      setForm({ look_up_name: '', look_up_domain: '', enabled: 'Y' });
      setPage(0);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleUpdate = async () => {
    if (!edit) return;
    try {
      await lookupApi.update(edit.lookUpId, {
        lookUpName: edit.lookUpName,
        lookUpDomain: edit.lookUpDomain,
        enabled: edit.enabled,
      });
      setEdit(null);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await lookupApi.remove(confirmDelete);
      setConfirmDelete(null);
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Lookups</Typography>

      <Box component="form" onSubmit={handleCreate} sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Filter Domain" fullWidth value={domain} onChange={e => { setDomain(e.target.value); setPage(0); }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Name" fullWidth value={form.look_up_name} onChange={e => setForm({ ...form, look_up_name: e.target.value })} required />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Domain" fullWidth value={form.look_up_domain} onChange={e => setForm({ ...form, look_up_domain: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Select fullWidth value={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.value })}>
              <MenuItem value="Y">Y</MenuItem>
              <MenuItem value="N">N</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button type="submit" variant="contained" fullWidth>Add</Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ height: 520, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          rowCount={rowCount}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={!!edit} onClose={() => setEdit(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Lookup</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" fullWidth value={edit?.lookUpName || ''} onChange={e => setEdit({ ...edit, lookUpName: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Domain" fullWidth value={edit?.lookUpDomain || ''} onChange={e => setEdit({ ...edit, lookUpDomain: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select fullWidth value={edit?.enabled || 'Y'} onChange={e => setEdit({ ...edit, enabled: e.target.value })}>
                <MenuItem value="Y">Y</MenuItem>
                <MenuItem value="N">N</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEdit(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this lookup?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Lookup;


