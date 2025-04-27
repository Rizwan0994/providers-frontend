import React from 'react';
import { Box, Button, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, Typography, Divider, CircularProgress } from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';

const ListManagementView = ({ lists, onViewList, onCreateList, isLoading }) => {
    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">My Provider Lists</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onCreateList} // Use the passed handler to open the dialog
                >
                    Create New List
                </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {isLoading && lists.length === 0 ? (
                 <Box sx={{ textAlign: 'center', p: 3 }}><CircularProgress /></Box>
            ) : lists.length === 0 ? (
                 <Typography sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
                     You haven't created any lists yet.
                 </Typography>
             ) : (
                 <List disablePadding>
                     {lists?.map((list, index) => (
                         <React.Fragment key={list._id || index}>
                             <ListItem sx={{ py: 1.5 }}>
                                 <ListItemText
                                     primary={list?.name}
                                     secondary={`${list?.providers.length || 0} providers`}
                                     primaryTypographyProps={{ fontWeight: 'medium' }}
                                 />
                                 <ListItemSecondaryAction>
                                     <Button
                                        startIcon={<Visibility />}
                                        onClick={() => onViewList(list)}
                                        size="small"
                                     >
                                         View
                                     </Button>
                                     {/* Add Edit/Delete buttons here later if needed */}
                                 </ListItemSecondaryAction>
                             </ListItem>
                             {index < lists.length - 1 && <Divider component="li" />}
                         </React.Fragment>
                     ))}
                 </List>
             )}
        </Paper>
    );
};

export default ListManagementView;