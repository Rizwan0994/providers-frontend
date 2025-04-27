import React, { useState, useMemo, useCallback } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Checkbox, Button, Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { CloudDownload, Search as SearchIcon, List as ListIcon, Visibility as VisibilityIcon } from '@mui/icons-material'; 
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';
import { findEmailForProvider } from '../services/providerService'; // Keep relevant service
import { useNavigate } from 'react-router-dom';
// Helper function to format CSV data (can be shared)
const formatProvidersForCsv = (providerData) => {
    return providerData.map((provider) => ({
        'NPI': provider.npi || provider.number, // Handle both formats if needed
        'Provider Name': `${provider.basic?.name_prefix || ''} ${provider.basic?.first_name || ''} ${provider.basic?.last_name || ''}`.trim(),
        'Specialty': provider.taxonomies?.find((t) => t.primary)?.desc || 'N/A',
        'Address': [
            provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.address_1,
            provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.city,
            provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.state,
            provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.postal_code
        ].filter(Boolean).join(', '),
        'Email': provider.basic?.email || '', // Use updated email if found
        'Phone': provider.addresses?.find((a) => a.address_purpose === 'LOCATION')?.telephone_number || '',
    }));
};


const ProviderSearchTable = ({ providers, onProvidersUpdated, onSaveSelectedToList, showSnackbar }) => {
    const [rowSelection, setRowSelection] = useState({}); // MRT manages selection state internally
    const [loadingEmails, setLoadingEmails] = useState({});
    const navigate = useNavigate();
    const handleViewProvider = useCallback((row) => {
        // Navigate to the provider detail page, passing the provider data as state
        navigate(`/provider/${row.original.number || row.original.npi}`, { state: row.original });
    }, [navigate]);

    const handleFindEmail = useCallback(async (row) => {
        // NPI might be under 'number' or 'npi' depending on source
        const npi = row.original.number || row.original.npi;
        const basicInfo = row.original.basic || {};
        const firstName = basicInfo.first_name;
        const lastName = basicInfo.last_name;
        // Use organization name if available, otherwise a default for the search
        const organizationName = basicInfo.organization_name || 'medical'; // Adjust default if needed

        if (!npi || !firstName || !lastName) {
            showSnackbar('Missing NPI, First Name, or Last Name for email search.', 'warning');
            return;
        }

        setLoadingEmails(prev => ({ ...prev, [npi]: true }));
        try {
            // Prepare data structure expected by findEmailForProvider
            const searchPayload = {
                npi: npi,
                basic: {
                    first_name: firstName,
                    last_name: lastName,
                    organization_name: organizationName
                }
                // Include other details if your service uses them (e.g., address)
            };

            const emailData = await findEmailForProvider(searchPayload);

            if (emailData?.email) {
                // Update the specific provider in the main list
                const updatedProviders = providers.map(p =>
                    (p.number === npi || p.npi === npi)
                        ? { ...p, basic: { ...p.basic, email: emailData.email } }
                        : p
                );
                console.log('Updated Providers:', updatedProviders); // Debugging
                onProvidersUpdated(updatedProviders); // Notify parent about the change
                showSnackbar(`Email found for ${firstName} ${lastName}!`);
            } else {
                // showSnackbar(`Email not found for ${firstName} ${lastName}.`, 'info');
                showSnackbar(emailData?.message || `Email not found for ${firstName} ${lastName}.`, 'info');
            }
        } catch (error) {
            console.error('Error finding email:', error);
            showSnackbar(`Failed to find email for ${firstName} ${lastName}. ${error.message || ''}`, 'error');
        } finally {
            setLoadingEmails(prev => ({ ...prev, [npi]: false }));
        }
    }, [providers, onProvidersUpdated, showSnackbar]);


    const columns = useMemo(() => [
        // Selection column managed by MRT enableRowSelection
        {
            accessorKey: 'basic.first_name', // Using dot notation is fine
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
            // Filter variant can be useful for specialties
            filterVariant: 'select',
            filterSelectOptions: // You might dynamically generate this from `providers` data
                [...new Set(providers.flatMap(p => p.taxonomies?.map(t => t.desc) || []))]
                    .filter(Boolean)
                    .sort(),

        },
        {
            accessorKey: 'addresses',
            header: 'Address',
            Cell: ({ row }) => {
                const locationAddress = row.original.addresses?.find(a => a.address_purpose === 'LOCATION');
                if (!locationAddress) return 'N/A';
                return (
                    <div className="text-gray-700 text-sm">
                        <div>{locationAddress.address_1}</div>
                        <div>
                            {[locationAddress.city, locationAddress.state, locationAddress.postal_code]
                                .filter(Boolean)
                                .join(', ')}
                        </div>
                    </div>
                );
            },
            enableColumnFilter: false, // Address filtering is complex
        },
        {
            // Access the email potentially updated in the state
            accessorFn: (originalRow) => originalRow.basic?.email,
            id: 'email', // Important to have a unique ID if accessorFn is used
            header: 'Email',
            Cell: ({ row }) => {
                const email = row.getValue() || row.original.basic?.email; // Access email from original data
                console.log('Email:', email); // Debugging
                // NPI might be 'number' or 'npi'
                const npi = row.original.number || row.original.npi;

                return email ? (
                    <a className="text-blue-600 hover:underline text-sm" href={`mailto:${email}`}>
                        {email}
                    </a>
                ) : (
                    <Tooltip title="Find Email">
                        <span> {/* Tooltip needs a DOM element when button is disabled */}
                            <IconButton
                                onClick={() => handleFindEmail(row)}
                                disabled={loadingEmails[npi]}
                                size="small"
                                color="primary"
                            >
                                {loadingEmails[npi] ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <SearchIcon fontSize="inherit" />
                                )}
                            </IconButton>
                        </span>
                    </Tooltip>
                );
            },
            enableColumnFilter: false, // Email filtering might not be needed
        },
        {
            id: 'phone',
            header: 'Phone',
            accessorFn: (originalRow) =>
                originalRow.addresses?.find(a => a.address_purpose === 'LOCATION')?.telephone_number,
            Cell: ({ row }) => {
                const phone = row.original.addresses?.find(a => a.address_purpose === 'LOCATION')?.telephone_number;
                return <span className="text-sm">{phone || 'N/A'}</span>;
            },
            enableColumnFilter: false,
        },
        // NPI column might be useful
        {
            accessorKey: 'number', // or 'npi' depending on your data structure
            header: 'NPI',
            size: 120,
        },
        {
            id: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewProvider(row)} size="small">
                        <VisibilityIcon color="info" />
                    </IconButton>
                </Tooltip>
            ),
            enableColumnFilter: false,
            enableSorting: false,
        },
    ], [providers, loadingEmails, handleFindEmail, handleViewProvider, navigate]); 

    const handleDownloadCsv = useCallback((rows) => {
        const selectedData = rows.map(row => row.original);
        if (selectedData.length === 0) {
            showSnackbar('No providers selected to export', 'warning');
            return;
        }
        const csvData = formatProvidersForCsv(selectedData);
        const csv = unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'selected_providers.csv');
    }, [showSnackbar]);

    const handleTriggerSaveToList = useCallback((rows) => {
        // Extract NPIs (handle potential variations in property name)
        const selectedNpis = rows.map(row => row.original.number || row.original.npi).filter(Boolean);
        onSaveSelectedToList(selectedNpis); // Call the parent handler
    }, [onSaveSelectedToList]);


    const table = useMaterialReactTable({
        columns,
        data: providers, // Use the providers passed from the parent
        enableRowSelection: true, // Let MRT handle selection state
        onRowSelectionChange: setRowSelection, // Update local state when MRT selection changes
        state: { rowSelection }, // Connect local state to MRT
        getRowId: (row) => row.number || row.npi, // Important for selection persistence
        paginationDisplayMode: 'pages',
        initialState: { density: 'compact', pagination: { pageSize: 15, pageIndex: 0 } }, // Sensible defaults

        // --- Toolbar Customization ---
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ListIcon />}
                    onClick={() => handleTriggerSaveToList(table.getSelectedRowModel().flatRows)}
                    disabled={table.getSelectedRowModel().flatRows.length === 0}
                >
                    Save Selected to List ({table.getSelectedRowModel().flatRows.length})
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CloudDownload />}
                    onClick={() => handleDownloadCsv(table.getSelectedRowModel().flatRows)}
                    disabled={table.getSelectedRowModel().flatRows.length === 0}
                >
                    Export Selected ({table.getSelectedRowModel().flatRows.length})
                </Button>
            </Box>
        ),
    });

    return <MaterialReactTable table={table} />;
};

export default ProviderSearchTable;