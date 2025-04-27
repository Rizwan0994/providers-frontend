// frontend/src/components/ProviderTable.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import {
    Checkbox,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Snackbar,
    Alert,
    Box,
    IconButton,
    Tooltip,
    CircularProgress,
    Tabs,
    Tab,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider
} from '@mui/material';
import { Add, CloudDownload, Search as SearchIcon, List as ListIcon, Close } from '@mui/icons-material';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';
import { createList, addProvidersToList, findEmailForProvider, fetchLists, getListProviders } from '../services/providerService';

const ProviderTable = ({ providers, onProvidersUpdated }) => {
    const [selectedProviders, setSelectedProviders] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loadingEmails, setLoadingEmails] = useState({});
    const [lists, setLists] = useState([]);
    const [activeTab, setActiveTab] = useState('providers'); // 'providers' or 'lists'
    const [currentList, setCurrentList] = useState(null);
    const [listProviders, setListProviders] = useState([]);
    const [isListDialogOpen, setIsListDialogOpen] = useState(false);
    const [newListName, setNewListName] = useState('');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const loadLists = useCallback(async () => {
        try {
            const fetchedLists = await fetchLists();
            setLists(fetchedLists);
        } catch (error) {
            console.error("Failed to load lists", error);
            showSnackbar('Failed to load lists.', 'error');
        }
    }, []);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    useEffect(() => {
        loadLists();
    }, [loadLists]);

    const handleSaveToNewList = async () => {
        if (!newListName.trim()) {
            showSnackbar('Please enter a list name', 'warning');
            return;
        }

        if (Object.keys(selectedProviders).length === 0) {
            showSnackbar('Please select providers to save', 'warning');
            return;
        }

        console.log('Selected providers->:', selectedProviders);

        try {
            const selectedNpis = Object.keys(selectedProviders).filter(npi => selectedProviders[npi]);
            const newList = await createList(newListName.trim());
            await addProvidersToList(newList.id, selectedNpis);
            showSnackbar('Providers saved to new list!');
            setNewListName('');
            setIsListDialogOpen(false);
            await loadLists();
        } catch (error) {
            console.error('Error saving to list:', error);
            showSnackbar('Failed to save providers to list.', 'error');
        }
    };

    const handleAddToExistingList = async (listId) => {
        if (Object.keys(selectedProviders).length === 0) {
            showSnackbar('Please select providers to save', 'warning');
            return;
        }

        try {
            const selectedNpis = Object.keys(selectedProviders).filter(npi => selectedProviders[npi]);
            await addProvidersToList(listId, selectedNpis);
            showSnackbar('Providers added to list!');
            setSelectedProviders({});
        } catch (error) {
            console.error('Error adding to list:', error);
            showSnackbar('Failed to add providers to list.', 'error');
        }
    };

    const handleDownloadCsv = (providersToExport = null) => {
        console.log('Exporting providers to CSV:', providersToExport);
        const providerData = providersToExport ||
            providers.filter((provider) => selectedProviders[provider.npi]);

        if (providerData.length === 0) {
            showSnackbar('No providers to export', 'warning');
            return;
        }

        const csvData = providerData.map((provider) => ({
            'NPI': provider.npi,
            'Provider Name': `${provider.basic?.name_prefix || ''} ${provider.basic?.first_name || ''} ${provider.basic?.last_name || ''}`.trim(),
            'Specialty': provider.taxonomies?.find((t) => t.primary)?.desc || 'N/A',
            'Address': [
                provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.address_1,
                provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.city,
                provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.state,
                provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.postal_code
            ].filter(Boolean).join(', '),
            'Email': provider.basic?.email || '',
            'Phone': provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.telephone_number || '',
        }));

        const csv = unparse(csvData);
        const filename = providersToExport ? `${currentList?.name}_providers.csv` : 'selected_providers.csv';
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, filename);
    };

    const handleSelectProvider = (npi, isSelected) => {
        setSelectedProviders(prev => ({ ...prev, [npi]: isSelected }));
    };

    const handleSelectAllProviders = (isSelected) => {
        const allNpis = (currentList ? listProviders : providers).map(p => p.npi);
        const newSelection = {};
        allNpis.forEach(npi => newSelection[npi] = isSelected);
        setSelectedProviders(newSelection);
    };

    const handleFindEmail = async (row) => {
        const npi = row.original.number;
        const firstName = row.original.basic?.first_name;
        const lastName = row.original.basic?.last_name;
        const organizationName = row.original.basic?.organization_name || 'medical';

        if (!firstName || !lastName) {
            showSnackbar('Missing provider information for email search.', 'warning');
            return;
        }

        setLoadingEmails(prev => ({ ...prev, [npi]: true }));
        try {
            const emailData = await findEmailForProvider({
                npi,
                basic: {
                    first_name: firstName,
                    last_name: lastName,
                    organization_name: organizationName
                }
            });

            if (emailData?.email) {
                const updatedProviders = providers.map(p =>
                    p.npi === npi ? { ...p, basic: { ...p.basic, email: emailData.email } } : p
                );
                onProvidersUpdated(updatedProviders);
                showSnackbar(`Email found for ${firstName} ${lastName}!`);
            } else {
                showSnackbar(`Email not found for ${firstName} ${lastName}.`, 'info');
            }
        } catch (error) {
            console.error('Error finding email:', error);
            showSnackbar(`Failed to find email for ${firstName} ${lastName}.`, 'error');
        } finally {
            setLoadingEmails(prev => ({ ...prev, [npi]: false }));
        }
    };

    const handleViewList = async (list) => {
        try {
            setCurrentList(list);
            const providers = await getListProviders(list._id);
            setListProviders(providers);
            setActiveTab('listView');
            setSelectedProviders({});
        } catch (error) {
            console.error('Error loading list providers:', error);
            showSnackbar('Failed to load list providers', 'error');
        }
    };

    const columns = useMemo(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    indeterminate={table.getIsSomeRowsSelected()}
                    checked={table.getIsAllRowsSelected()}
                    onChange={(e) => handleSelectAllProviders(e.target.checked)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedProviders[row.original.number] || false}
                    onChange={(e) => handleSelectProvider(row.original.number, e.target.checked)}
                />
            ),
            size: 40,
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            accessorKey: 'basic.first_name',
            header: 'Provider Name',
            Cell: ({ row }) => {
                const basic = row.original.basic || {};
                return (
                    <span className="font-semibold">
                        {[(basic.name_prefix && basic.name_prefix !== '--' ? basic.name_prefix : ""), basic.first_name, basic.last_name]
                            .filter(Boolean)
                            .join(' ')}
                    </span>
                );
            },
        },
        {
            accessorKey: 'enumeration_type', // Using dot notation is fine
            header: 'NPI Type',
            Cell: ({ row }) => {
                const type = row.original.enumeration_type || {};
                return (
                    <span className="font-semibold">
                        {type === 'NPI-1' ? 'Individual' : type === 'NPI-2' ? 'Organization' : 'Unknown'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'taxonomies',
            header: 'Specialty',
            Cell: ({ row }) => {
                const primaryTaxonomy = row.original.taxonomies?.find(t => t.primary);
                return (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {primaryTaxonomy?.desc || 'N/A'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'addresses',
            header: 'Address',
            Cell: ({ row }) => {
                const locationAddress = row.original.addresses?.find(a => a.address_purpose === 'LOCATION');
                return (
                    <div className="text-gray-700">
                        <div>{locationAddress?.address_1 || 'N/A'}</div>
                        <div>
                            {[locationAddress?.city, locationAddress?.state, locationAddress?.postal_code]
                                .filter(Boolean)
                                .join(', ')}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            Cell: ({ row }) => {
                const email = row.original.basic?.email;
                const npi = row.original.number;

                return email ? (
                    <a className="text-blue-600 hover:underline" href={`mailto:${email}`}>
                        {email}
                    </a>
                ) : (
                    <Tooltip title="Find Email">
                        <IconButton
                            onClick={() => handleFindEmail(row)}
                            disabled={loadingEmails[npi]}
                            size="small"
                        >
                            {loadingEmails[npi] ? (
                                <CircularProgress size={20} />
                            ) : (
                                <SearchIcon fontSize="small" />
                            )}
                        </IconButton>
                    </Tooltip>
                );
            },
        },
        {
            accessorKey: 'phone',
            header: 'Contact',
            Cell: ({ row }) => {
                const locationAddress = row.original.addresses?.find(a => a.address_purpose === 'LOCATION');
                return <span className="text-sm">{locationAddress?.telephone_number || 'N/A'}</span>;
            },
        },
    ], [selectedProviders, loadingEmails]);

    const table = useMaterialReactTable({
        columns,
        data: activeTab === 'providers' ? providers : listProviders,
        enableRowSelection: true,
        onRowSelectionChange: (updater) => {
            const newSelection = typeof updater === 'function'
                ? updater(selectedProviders)
                : updater;
            setSelectedProviders(newSelection);
        },
        state: {
            rowSelection: selectedProviders,
        },
        renderTopToolbar: ({ table }) => (
            <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{ flexGrow: 1 }}
                >
                    <Tab label="Providers" value="providers" />
                    <Tab label="My Lists" value="lists" />
                    {currentList && <Tab label={currentList.name} value="listView" />}
                </Tabs>

                {activeTab === 'providers' && (
                    <>
                        <Button
                            startIcon={<ListIcon />}
                            onClick={() => setIsListDialogOpen(true)}
                            disabled={!Object.values(selectedProviders).some(Boolean)}
                            variant="outlined"
                        >
                            Save to List
                        </Button>
                        <Button
                            startIcon={<CloudDownload />}
                            onClick={() => handleDownloadCsv()}
                            disabled={!Object.values(selectedProviders).some(Boolean)}
                            variant="contained"
                            color="primary"
                        >
                            Export Selected
                        </Button>
                    </>
                )}

                {activeTab === 'listView' && (
                    <Button
                        startIcon={<CloudDownload />}
                        onClick={() => handleDownloadCsv(listProviders)}
                        variant="contained"
                        color="primary"
                    >
                        Export List
                    </Button>
                )}
            </Box>
        ),
    });

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            {activeTab === 'lists' ? (
                <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Button
                            startIcon={<Add />}
                            onClick={() => {
                                setIsListDialogOpen(true);
                                setNewListName('');
                            }}
                            variant="contained"
                        >
                            Create New List
                        </Button>
                    </Box>

                    <List>
                        {lists.map(list => (
                            <React.Fragment key={list._id}>
                                <ListItem>
                                    <ListItemText
                                        primary={list.name}
                                        secondary={`${list.provider_count || 0} providers`}
                                    />
                                    <ListItemSecondaryAction>
                                        <Button onClick={() => handleViewList(list)}>
                                            View
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            ) : (
                <MaterialReactTable table={table} />
            )}

            {/* Create List Dialog */}
            <Dialog open={isListDialogOpen} onClose={() => setIsListDialogOpen(false)}>
                <DialogTitle>
                    {newListName ? 'Create New List' : 'Save to List'}
                    <IconButton
                        onClick={() => setIsListDialogOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    {!newListName && (
                        <>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={() => setNewListName('New List')}
                                >
                                    Create New List
                                </Button>
                            </Box>
                            <Divider sx={{ my: 2 }}>OR</Divider>
                            <Box>
                                <h4>Add to Existing List</h4>
                                <List>
                                    {lists.map(list => (
                                        <ListItem
                                            key={list.id}
                                            button
                                            onClick={() => {
                                                handleAddToExistingList(list._id);
                                                setIsListDialogOpen(false);
                                            }}
                                        >
                                            <ListItemText
                                                primary={list.name}
                                                secondary={`${list.provider_count || 0} providers`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </>
                    )}

                    {newListName && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="List Name"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                autoFocus
                            />
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    onClick={handleSaveToNewList}
                                    variant="contained"
                                    disabled={!newListName.trim()}
                                >
                                    Create List
                                </Button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProviderTable;