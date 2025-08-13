import React, { useEffect, useMemo, useState } from 'react';
import { Box, Tabs, Tab, Grid, TextField, Select, MenuItem, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { coaApi } from '../../utils/coaApi';

const LEVELS = { MAIN: 1, SUB: 2, CHILD: 3 };
const TYPES = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

const padCode = (level, code) => {
  const onlyDigits = (code || '').replace(/\D/g, '');
  const width = level === LEVELS.MAIN ? 2 : level === LEVELS.SUB ? 3 : 4;
  return onlyDigits.padStart(width, '0').slice(-width);
};

const CoaGrid = ({ level, parentId, onEdit, onDeleted }) => {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const columns = useMemo(() => [
    { field: 'code', headerName: 'Code', width: 110 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
    { field: 'type', headerName: 'Type', width: 140 },
    { field: 'enabled', headerName: 'Enabled', width: 110 },
    { field: 'fullPath', headerName: 'Full Path', flex: 1.2, minWidth: 220 },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => onEdit(params.row)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => setConfirmDelete(params.row.id)}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      )
    }
  ], [onEdit]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await coaApi.search({ level, parentId: parentId || '', term, page: page + 1, pageSize });
      const { items, totalCount, item1, item2 } = res.result || res.Result || {};
      const list = items || item1 || [];
      const total = (typeof totalCount === 'number' ? totalCount : item2) || 0;
      setRows(list.map(x => ({
        id: x.id ?? x.Id,
        parentId: x.parentId ?? x.ParentId,
        level: x.level ?? x.Level,
        code: x.code ?? x.Code,
        name: x.name ?? x.Name,
        type: x.type ?? x.Type,
        enabled: x.enabled ?? x.Enabled,
        fullPath: x.fullPath ?? x.FullPath,
      })));
      setRowCount(total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { setPage(0); }, [parentId, level]);
  useEffect(() => { fetchData(); }, [level, parentId, term, page, pageSize]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await coaApi.remove(confirmDelete); setConfirmDelete(null); onDeleted?.(); fetchData(); } catch (e) { console.error(e); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        <TextField size="small" label="Search" value={term} onChange={e => { setTerm(e.target.value); setPage(0); }} />
      </Box>
      <Box sx={{ height: 520 }}>
        <DataGrid rows={rows} columns={columns} loading={loading}
          pagination rowCount={rowCount} paginationMode="server"
          page={page} onPageChange={(p) => setPage(p)}
          pageSize={pageSize} onPageSizeChange={(s) => { setPageSize(s); setPage(0); }}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </Box>

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this account?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ChartOfAccounts = () => {
  const [tab, setTab] = useState(0);
  const [mainParents, setMainParents] = useState([]);
  const [subParents, setSubParents] = useState([]);
  const [edit, setEdit] = useState(null);

  const [mainForm, setMainForm] = useState({ code: '', name: '', type: TYPES[0], description: '', enabled: 'Y' });
  const [subForm, setSubForm] = useState({ parentId: '', code: '', name: '', description: '', enabled: 'Y' });
  const [childForm, setChildForm] = useState({ parentId: '', code: '', name: '', description: '', enabled: 'Y' });

  const loadParents = async () => {
    // Load main for sub's parent, load sub for child's parent
    try {
      const mainRes = await coaApi.search({ level: LEVELS.MAIN, page: 1, pageSize: 1000 });
      const mainItems = (mainRes.result?.items || mainRes.Result?.item1 || []).map(x => ({ id: x.id ?? x.Id, code: x.code ?? x.Code, name: x.name ?? x.Name }));
      setMainParents(mainItems);
      const subRes = await coaApi.search({ level: LEVELS.SUB, page: 1, pageSize: 1000 });
      const subItems = (subRes.result?.items || subRes.Result?.item1 || []).map(x => ({ id: x.id ?? x.Id, code: x.code ?? x.Code, name: x.name ?? x.Name }));
      setSubParents(subItems);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { loadParents(); }, []);

  const handleCreate = async (level) => {
    try {
      if (level === LEVELS.MAIN) {
        await coaApi.create({ level, parentId: null, code: padCode(level, mainForm.code), name: mainForm.name, type: mainForm.type, description: mainForm.description, enabled: mainForm.enabled });
        setMainForm({ code: '', name: '', type: TYPES[0], description: '', enabled: 'Y' });
      } else if (level === LEVELS.SUB) {
        await coaApi.create({ level, parentId: Number(subForm.parentId), code: padCode(level, subForm.code), name: subForm.name, type: 'Asset', description: subForm.description, enabled: subForm.enabled });
        setSubForm({ parentId: '', code: '', name: '', description: '', enabled: 'Y' });
      } else if (level === LEVELS.CHILD) {
        await coaApi.create({ level, parentId: Number(childForm.parentId), code: padCode(level, childForm.code), name: childForm.name, type: 'Asset', description: childForm.description, enabled: childForm.enabled });
        setChildForm({ parentId: '', code: '', name: '', description: '', enabled: 'Y' });
      }
    } catch (e) { console.error(e); }
  };

  const onSaved = () => { loadParents(); };

  const EditDialog = () => (
    <Dialog open={!!edit} onClose={() => setEdit(null)} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        {edit && (
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={4}><TextField label="Code" fullWidth value={padCode(edit.level, edit.code)} onChange={e => setEdit({ ...edit, code: e.target.value })} /></Grid>
            <Grid item xs={12} sm={8}><TextField label="Name" fullWidth value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><Select fullWidth value={edit.enabled || 'Y'} onChange={e => setEdit({ ...edit, enabled: e.target.value })}><MenuItem value="Y">Y</MenuItem><MenuItem value="N">N</MenuItem></Select></Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEdit(null)}>Cancel</Button>
        <Button variant="contained" onClick={async () => { try { await coaApi.update(edit.id, { id: edit.id, level: edit.level, parentId: edit.parentId || null, code: padCode(edit.level, edit.code), name: edit.name, type: edit.type || 'Asset', description: edit.description, enabled: edit.enabled }); setEdit(null); onSaved(); } catch (e) { console.error(e); } }}>Save</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Chart of Accounts</Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Main" />
        <Tab label="Sub" />
        <Tab label="Child" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={2}><TextField label="Code (2)" fullWidth value={mainForm.code} onChange={e => setMainForm({ ...mainForm, code: e.target.value })} onBlur={e => setMainForm({ ...mainForm, code: padCode(LEVELS.MAIN, e.target.value) })} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Name" fullWidth value={mainForm.name} onChange={e => setMainForm({ ...mainForm, name: e.target.value })} /></Grid>
            <Grid item xs={12} sm={3}><Select fullWidth value={mainForm.type} onChange={e => setMainForm({ ...mainForm, type: e.target.value })}>{TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</Select></Grid>
            <Grid item xs={12} sm={2}><Select fullWidth value={mainForm.enabled} onChange={e => setMainForm({ ...mainForm, enabled: e.target.value })}><MenuItem value="Y">Y</MenuItem><MenuItem value="N">N</MenuItem></Select></Grid>
            <Grid item xs={12} sm={1}><Button variant="contained" fullWidth onClick={async () => { await handleCreate(LEVELS.MAIN); onSaved(); }}>Add</Button></Grid>
            <Grid item xs={12}><TextField label="Description" fullWidth value={mainForm.description} onChange={e => setMainForm({ ...mainForm, description: e.target.value })} /></Grid>
          </Grid>
          <CoaGrid level={LEVELS.MAIN} onEdit={setEdit} onDeleted={onSaved} />
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={3}><Select fullWidth displayEmpty value={subForm.parentId} onChange={e => setSubForm({ ...subForm, parentId: e.target.value })}><MenuItem value=""><em>Select Main</em></MenuItem>{mainParents.map(p => <MenuItem key={p.id} value={p.id}>{p.code} - {p.name}</MenuItem>)}</Select></Grid>
            <Grid item xs={12} sm={2}><TextField label="Code (3)" fullWidth value={subForm.code} onChange={e => setSubForm({ ...subForm, code: e.target.value })} onBlur={e => setSubForm({ ...subForm, code: padCode(LEVELS.SUB, e.target.value) })} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Name" fullWidth value={subForm.name} onChange={e => setSubForm({ ...subForm, name: e.target.value })} /></Grid>
            <Grid item xs={12} sm={2}><Select fullWidth value={subForm.enabled} onChange={e => setSubForm({ ...subForm, enabled: e.target.value })}><MenuItem value="Y">Y</MenuItem><MenuItem value="N">N</MenuItem></Select></Grid>
            <Grid item xs={12} sm={1}><Button variant="contained" fullWidth disabled={!subForm.parentId} onClick={async () => { await handleCreate(LEVELS.SUB); onSaved(); }}>Add</Button></Grid>
            <Grid item xs={12}><TextField label="Description" fullWidth value={subForm.description} onChange={e => setSubForm({ ...subForm, description: e.target.value })} /></Grid>
          </Grid>
          <CoaGrid level={LEVELS.SUB} parentId={subForm.parentId || undefined} onEdit={setEdit} onDeleted={onSaved} />
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={3}><Select fullWidth displayEmpty value={childForm.parentId} onChange={e => setChildForm({ ...childForm, parentId: e.target.value })}><MenuItem value=""><em>Select Sub</em></MenuItem>{subParents.map(p => <MenuItem key={p.id} value={p.id}>{p.code} - {p.name}</MenuItem>)}</Select></Grid>
            <Grid item xs={12} sm={2}><TextField label="Code (4)" fullWidth value={childForm.code} onChange={e => setChildForm({ ...childForm, code: e.target.value })} onBlur={e => setChildForm({ ...childForm, code: padCode(LEVELS.CHILD, e.target.value) })} /></Grid>
            <Grid item xs={12} sm={5}><TextField label="Name" fullWidth value={childForm.name} onChange={e => setChildForm({ ...childForm, name: e.target.value })} /></Grid>
            <Grid item xs={12} sm={1.5}><Select fullWidth value={childForm.enabled} onChange={e => setChildForm({ ...childForm, enabled: e.target.value })}><MenuItem value="Y">Y</MenuItem><MenuItem value="N">N</MenuItem></Select></Grid>
            <Grid item xs={12} sm={0.5}><Button variant="contained" fullWidth disabled={!childForm.parentId} onClick={async () => { await handleCreate(LEVELS.CHILD); onSaved(); }}>Add</Button></Grid>
            <Grid item xs={12}><TextField label="Description" fullWidth value={childForm.description} onChange={e => setChildForm({ ...childForm, description: e.target.value })} /></Grid>
          </Grid>
          <CoaGrid level={LEVELS.CHILD} parentId={childForm.parentId || undefined} onEdit={setEdit} onDeleted={onSaved} />
        </Box>
      )}

      <EditDialog />
    </Box>
  );
};

export default ChartOfAccounts;


