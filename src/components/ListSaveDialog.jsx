import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    Typography,
    CircularProgress,
    ListItemButton
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';

const ListSaveDialog = ({ open, onClose, lists, onSaveToNew, onSaveToExisting, hasProvidersToSave }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [isSaving, setIsSaving] = useState(false); // Loading state for save actions

    // Reset form when dialog opens or closes
    useEffect(() => {
        if (open) {
            setShowCreateForm(false);
            setNewListName('');
            setIsSaving(false);
        }
    }, [open]);

    const handleCreateClick = () => {
        setShowCreateForm(true);
        // Auto-focus might be tricky depending on Dialog lifecycle,
        // but setting state should make the TextField render.
    };

    const handleSaveNew = async () => {
        if (!newListName.trim()) return; // Basic validation
        setIsSaving(true);
        await onSaveToNew(newListName.trim()); // Let parent handle actual logic and closing
        setIsSaving(false); // Reset loading state (parent might close dialog before this if successful)
    };

    const handleSaveExisting = async (listId) => {
         setIsSaving(true);
         await onSaveToExisting(listId); // Let parent handle logic and closing
         setIsSaving(false);
     };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {showCreateForm ? 'Create New List' : (hasProvidersToSave ? 'Save Providers to List' : 'Create List')}
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {/* --- Create New Section --- */}
                {showCreateForm ? (
                    <Box>
                        <TextField
                            fullWidth
                            label="New List Name"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            variant="outlined"
                            autoFocus
                            sx={{ mb: 2 }}
                            disabled={isSaving}
                        />
                        <DialogActions sx={{ p: 0 }}>
                            <Button onClick={() => setShowCreateForm(false)} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveNew}
                                variant="contained"
                                disabled={!newListName.trim() || isSaving}
                                startIcon={isSaving ? <CircularProgress size={16} color="inherit"/> : null}
                            >
                                {hasProvidersToSave ? 'Create & Save' : 'Create List'}
                            </Button>
                        </DialogActions>
                    </Box>
                ) : (
                     <>
                         {/* Only show create button if we intend to *save* providers */}
                         {hasProvidersToSave && (
                             <Button
                                 fullWidth
                                 variant="outlined"
                                 startIcon={<Add />}
                                 onClick={handleCreateClick}
                                 sx={{ mb: 2 }}
                                 disabled={isSaving}
                             >
                                 Create New List
                             </Button>
                          )}

                         {/* Show Add to Existing only if there are lists AND providers to save */}
                         {hasProvidersToSave && lists.length > 0 && (
                              <>
                                 <Divider sx={{ my: 2 }}>OR</Divider>
                                 <Typography variant="subtitle1" sx={{ mb: 1 }}>Add to Existing List</Typography>
                                 <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                     {lists.map(list => (
                                         <ListItemButton
                                             key={list._id}
                                             onClick={() => handleSaveExisting(list._id)}
                                             disabled={isSaving}
                                         >
                                             <ListItemText
                                                 primary={list.name}
                                                 secondary={`${list.provider_count || 0} providers`}
                                             />
                                              {isSaving && <CircularProgress size={16} sx={{ ml: 1 }}/>}
                                         </ListItemButton>
                                     ))}
                                 </List>
                             </>
                         )}

                         {/* If only creating an empty list (no providers selected) */}
                          {!hasProvidersToSave && (
                              <Button
                                  fullWidth
                                  variant="contained"
                                  startIcon={<Add />}
                                  onClick={handleCreateClick}
                                  disabled={isSaving}
                              >
                                  Create a New Empty List
                              </Button>
                          )}

                         {/* Handle case where there are no lists to add to */}
                         {hasProvidersToSave && lists.length === 0 && !showCreateForm && (
                             <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
                                 No existing lists found. Create a new one to save providers.
                             </Typography>
                         )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ListSaveDialog;