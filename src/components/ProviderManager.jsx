import React, { useState, useCallback, useEffect } from 'react';
import { Box, Tabs, Tab, Snackbar, Alert, Paper, CircularProgress } from '@mui/material';
import ProviderSearchTable from './ProviderSearchTable';
import ListManagementView from './ListManagementView';
import ListView from './ListView';
import ListSaveDialog from './ListSaveDialog'; // Assuming you extract the dialog logic
import {
    createList,
    addProvidersToList,
    fetchLists,
    getListProviders,
    // findEmailForProvider // Keep this within ProviderSearchTable or pass down if needed elsewhere
} from '../services/providerService';

const ProviderManager = ({ initialProviders, onProvidersUpdated }) => {
    // --- State ---
    const [activeView, setActiveView] = useState('search'); // 'search', 'lists', 'listView'
    const [providers, setProviders] = useState(initialProviders || []); // Main search results
    const [lists, setLists] = useState([]);
    const [currentList, setCurrentList] = useState(null); // Details of the list being viewed
    const [listProviders, setListProviders] = useState([]); // Providers for the list being viewed
    const [isLoading, setIsLoading] = useState(false); // General loading state

    // Snackbar State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // List Dialog State
    const [isListDialogOpen, setIsListDialogOpen] = useState(false);
    const [providersToSave, setProvidersToSave] = useState([]); // NPIs to save

    // --- Effects ---
    // Update local providers if the parent component sends new ones
    useEffect(() => {
        setProviders(initialProviders || []);
    }, [initialProviders]);

    // Load lists on mount and when needed
    const loadLists = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedLists = await fetchLists();
            setLists(fetchedLists);
        } catch (error) {
            console.error("Failed to load lists", error);
            showSnackbar('Failed to load lists.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLists();
    }, [loadLists]);

    // --- Snackbar Handler ---
    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    const handleSnackbarClose = () => setSnackbarOpen(false);

    // --- Navigation Handlers ---
    const handleTabChange = (event, newValue) => {
        setActiveView(newValue);
        if (newValue === 'lists' || newValue === 'search') {
            setCurrentList(null); // Clear current list when navigating away from list view
            setListProviders([]);
        }
        if (newValue === 'lists') {
           loadLists(); // Re-fetch lists when navigating to the lists tab
        }
    };

    const handleViewList = async (list) => {
        setIsLoading(true);
        setActiveView('listView');
        setCurrentList(list);
        try {
            const providersData = await getListProviders(list._id);
            console.log('List providers:', providersData);
            const providersArray = providersData?.results ?? providersData ?? [];

            setListProviders(providersArray);
        } catch (error) {
            console.error('Error loading list providers:', error);
            showSnackbar('Failed to load list providers', 'error');
            setActiveView('lists'); // Go back if loading failed
            setCurrentList(null);
        } finally {
            setIsLoading(false);
        }
    };

    // --- List Action Handlers ---
    const handleOpenSaveDialog = (selectedNpis) => {
        if (!selectedNpis || selectedNpis.length === 0) {
            showSnackbar('Please select providers to save', 'warning');
            return;
        }
        setProvidersToSave(selectedNpis);
        setIsListDialogOpen(true);
    };

    const handleSaveToNewList = async (newListName) => {
        if (!newListName.trim()) {
            showSnackbar('Please enter a list name', 'warning');
            return; // Keep dialog open
        }
        setIsLoading(true);
        try {
            const newList = await createList(newListName.trim());
            await addProvidersToList(newList.id, providersToSave);
            showSnackbar(`Providers saved to new list '${newListName}'!`);
            await loadLists(); // Refresh list counts etc.
            setIsListDialogOpen(false); // Close dialog on success
            setProvidersToSave([]);
        } catch (error) {
            console.error('Error saving to new list:', error);
            showSnackbar('Failed to save providers to new list.', 'error');
            // Keep dialog open on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveToExistingList = async (listId) => {
        setIsLoading(true);
        try {
            await addProvidersToList(listId, providersToSave);
            const listName = lists.find(l => l._id === listId)?.name || 'the list';
            showSnackbar(`Providers added to list '${listName}'!`);
            await loadLists(); // Refresh list counts etc.
            setIsListDialogOpen(false); // Close dialog on success
            setProvidersToSave([]);
        } catch (error) {
            console.error('Error adding to existing list:', error);
            showSnackbar('Failed to add providers to existing list.', 'error');
            // Keep dialog open on error
        } finally {
            setIsLoading(false);
        }
    };

    // --- Provider Data Update Handler ---
    // This function allows ProviderSearchTable to update the main provider list (e.g., after finding an email)
    const handleProvidersUpdated = (updatedProviders) => {
        setProviders(updatedProviders);
        // Optionally notify the parent component if needed
        if (onProvidersUpdated) {
            onProvidersUpdated(updatedProviders);
        }
    };

    // --- Rendering Logic ---
    const renderActiveView = () => {
        if (isLoading && activeView !== 'search') { // Allow search table interaction while lists load initially
             return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}><CircularProgress /></Box>;
        }

        switch (activeView) {
            case 'search':
                return (
                    <ProviderSearchTable
                        providers={providers}
                        onProvidersUpdated={handleProvidersUpdated} // Pass the update handler
                        onSaveSelectedToList={handleOpenSaveDialog} // Pass the dialog opener
                        showSnackbar={showSnackbar} // Pass snackbar utility
                    />
                );
            case 'lists':
                return (
                    <ListManagementView
                        lists={lists}
                        onViewList={handleViewList}
                        onCreateList={() => {
                            setProvidersToSave([]); // No providers pre-selected when creating from here
                            setIsListDialogOpen(true);
                         }}
                        isLoading={isLoading} // Pass loading state
                    />
                );
            case 'listView':
                return (
                    <ListView
                        listDetails={currentList}
                        listProviders={listProviders}
                        showSnackbar={showSnackbar} // Pass snackbar utility
                        isLoading={isLoading} // Pass loading state
                    />
                );
            default:
                return <Box>Error: Unknown view</Box>;
        }
    };

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={1} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeView} onChange={handleTabChange} aria-label="Provider manager tabs">
                    <Tab label="Provider Search" value="search" />
                    <Tab label="My Lists" value="lists" />
                    {/* Dynamically add tab for the list view if active */}
                    {activeView === 'listView' && currentList && (
                        <Tab label={`List: ${currentList.name}`} value="listView" />
                    )}
                </Tabs>
            </Paper>

            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' /* Allow content scrolling */ }}>
                {renderActiveView()}
            </Box>

            <ListSaveDialog
                open={isListDialogOpen}
                onClose={() => setIsListDialogOpen(false)}
                lists={lists}
                onSaveToNew={handleSaveToNewList}
                onSaveToExisting={handleSaveToExistingList}
                hasProvidersToSave={providersToSave.length > 0} // Indicate if saving selection or just creating empty list
            />

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

export default ProviderManager;