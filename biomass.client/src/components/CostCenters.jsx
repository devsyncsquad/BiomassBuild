import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
	Box,
	Button,
	Card,
	CardContent,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Stack,
	TextField,
	Typography
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSnackbar } from 'notistack';

const emptyForm = {
	costCenterId: 0,
	code: '',
	name: '',
	isActive: true,
	parentCostCenterId: null,
	companyId: null,
	createdAt: null
};

const CostCenters = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [tree, setTree] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [form, setForm] = useState(emptyForm);
	const [parents, setParents] = useState([]);
	const [confirmOpen, setConfirmOpen] = useState(false);

	const loadTree = async () => {
		setLoading(true);
		try {
			const res = await axios.get('/api/CostCenters/GetCostCenterTree');
			if (res.data?.success) {
				setTree(res.data.result || []);
			} else {
				enqueueSnackbar(res.data?.message || 'Failed to load cost centers', { variant: 'error' });
			}
		} catch (e) {
			enqueueSnackbar('Error loading cost centers', { variant: 'error' });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTree();
	}, []);

	useEffect(() => {
		// parents are top-level nodes only
		setParents(tree.map(n => ({ id: n.costCenterId, label: `${n.name} (${n.code})` })));
	}, [tree]);

	const findNode = (nodes, id) => {
		for (const n of nodes) {
			if (n.costCenterId === id) return n;
			if (n.children?.length) {
				const f = findNode(n.children, id);
				if (f) return f;
			}
		}
		return null;
	};

	const handleSelect = (id) => {
		setSelectedId(id);
		const node = findNode(tree, id);
		if (node) setForm({ ...emptyForm, ...node });
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: name === 'companyId' ? (value === '' ? null : Number(value)) : value }));
	};

	const handleToggleActive = (e) => {
		setForm(prev => ({ ...prev, isActive: e.target.checked }));
	};

	const handleCreateParent = () => {
		setSelectedId(null);
		setForm({ ...emptyForm, parentCostCenterId: null });
	};

	const handleAddChild = () => {
		if (!selectedId) {
			enqueueSnackbar('Select a parent first', { variant: 'warning' });
			return;
		}
		const node = findNode(tree, selectedId);
		if (node?.parentCostCenterId) {
			enqueueSnackbar('Can only add sub-category under a parent', { variant: 'warning' });
			return;
		}
		setForm({ ...emptyForm, parentCostCenterId: selectedId });
	};

	const handleSave = async () => {
		try {
			if (!form.name?.trim()) {
				enqueueSnackbar('Name is required', { variant: 'warning' });
				return;
			}
			if (form.costCenterId && form.costCenterId > 0) {
				// update
				const payload = {
					costCenterId: form.costCenterId,
					name: form.name.trim(),
					isActive: !!form.isActive,
					parentCostCenterId: form.parentCostCenterId ?? null,
					companyId: form.companyId ?? null
				};
				const res = await axios.put(`/api/CostCenters/UpdateCostCenter/${form.costCenterId}`, payload);
				if (!res.data?.success) throw new Error(res.data?.message || 'Update failed');
				enqueueSnackbar('Updated', { variant: 'success' });
			} else {
				// create
				const payload = {
					name: form.name.trim(),
					isActive: !!form.isActive,
					parentCostCenterId: form.parentCostCenterId ?? null,
					companyId: form.companyId ?? null
				};
				const res = await axios.post('/api/CostCenters/CreateCostCenter', payload);
				if (!res.data?.success) throw new Error(res.data?.message || 'Create failed');
				enqueueSnackbar('Created', { variant: 'success' });
			}
			await loadTree();
		} catch (e) {
			enqueueSnackbar(e.message || 'Save failed', { variant: 'error' });
		}
	};

	const handleDelete = async () => {
		if (!form.costCenterId) return;
		try {
			const res = await axios.delete(`/api/CostCenters/DeleteCostCenter/${form.costCenterId}`);
			if (!res.data?.success) throw new Error(res.data?.message || 'Delete failed');
			enqueueSnackbar('Deleted', { variant: 'success' });
			setConfirmOpen(false);
			setForm(emptyForm);
			setSelectedId(null);
			await loadTree();
		} catch (e) {
			enqueueSnackbar(e.message || 'Delete failed', { variant: 'error' });
		}
	};

	const renderTree = (nodes) => (
		<List disablePadding>
			{nodes.map((n) => (
				<Box key={n.costCenterId}>
					<ListItem disablePadding>
						<ListItemButton selected={selectedId === n.costCenterId} onClick={() => handleSelect(n.costCenterId)}>
							<ListItemIcon>
								<AccountTreeIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText primary={n.name} secondary={n.code} />
						</ListItemButton>
					</ListItem>
					{n.children?.length ? (
						<Box sx={{ pl: 4 }}>
							{renderTree(n.children)}
						</Box>
					) : null}
					<Divider />
				</Box>
			))}
		</List>
	);

	return (
		<Box sx={{ p: 3 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h4">Cost Centers</Typography>
				<Stack direction="row" spacing={1}>
					<Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadTree} disabled={loading}>Refresh</Button>
					<Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateParent}>Create Parent</Button>
					<Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddChild} disabled={!selectedId}>Add Sub-Category</Button>
				</Stack>
			</Stack>

			<Grid container spacing={3}>
				<Grid item xs={12} md={5} lg={4}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>Hierarchy</Typography>
							{renderTree(tree)}
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={7} lg={8}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>Details</Typography>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<TextField label="Code" value={form.code} InputProps={{ readOnly: true }} fullWidth size="small" />
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth size="small" />
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField label="Parent" select fullWidth size="small" value={form.parentCostCenterId ?? ''} onChange={(e) => setForm(prev => ({ ...prev, parentCostCenterId: e.target.value === '' ? null : Number(e.target.value) }))}>
										<MenuItem value="">None</MenuItem>
										{parents.map(p => (
											<MenuItem key={p.id} value={p.id}>{p.label}</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField label="Company Id (optional)" name="companyId" value={form.companyId ?? ''} onChange={handleChange} type="number" fullWidth size="small" />
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
										<Checkbox checked={!!form.isActive} onChange={handleToggleActive} />
										<Typography variant="body2">Is Active</Typography>
									</Box>
								</Grid>
							</Grid>

							<Stack direction="row" spacing={1} sx={{ mt: 2 }}>
								<Button variant="contained" startIcon={<EditIcon />} onClick={handleSave}>Save</Button>
								<Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setConfirmOpen(true)} disabled={!form.costCenterId}>Delete</Button>
							</Stack>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
				<DialogTitle>Delete Cost Center</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This will delete the selected cost center and all its sub-categories. Are you sure?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
					<Button color="error" onClick={handleDelete}>Delete</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default CostCenters;


