import React, { useMemo, useCallback } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { CloudDownload } from '@mui/icons-material';
import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';

// Reuse the CSV formatting function (or import from a shared utils file)
const formatProvidersForCsv = (providerData) => {
     return providerData.map((provider) => ({
        'NPI': provider.npi || provider.number,
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
};

const ListView = ({ listDetails, listProviders, showSnackbar, isLoading }) => {
   console.log('ListView', { listDetails, listProviders, isLoading });
    const handleDownloadListCsv = useCallback(() => {
        if (!listProviders || listProviders.length === 0) {
            showSnackbar('This list is empty, nothing to export.', 'warning');
            return;
        }
        const csvData = formatProvidersForCsv(listProviders);
        const csv = unparse(csvData);
        const safeListName = listDetails?.name.replace(/[^a-z0-9]/gi, '_') || 'list';
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${safeListName}_providers.csv`);
    }, [listProviders, listDetails, showSnackbar]);

    const columns = useMemo(() => [
        // Columns similar to ProviderSearchTable, but potentially without selection or 'Find Email'
        {
            accessorKey: 'basic.first_name',
            header: 'Provider Name',
            Cell: ({ row }) => {
                const basic = row.original.basic || {};
                return <span className="font-semibold">{[basic.name_prefix, basic.first_name, basic.last_name].filter(Boolean).join(' ')}</span>;
            },
        },
        {
            accessorKey: 'taxonomies',
            header: 'Specialty',
            Cell: ({ row }) => {
                const primaryTaxonomy = row.original.taxonomies?.find(t => t.primary);
                return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{primaryTaxonomy?.desc || 'N/A'}</span>;
            },
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
                         <div>{[locationAddress.city, locationAddress.state, locationAddress.postal_code].filter(Boolean).join(', ')}</div>
                     </div>
                 );
            },
        },
         {
             accessorFn: (originalRow) => originalRow.basic?.email,
             id: 'email',
             header: 'Email',
             Cell: ({ row }) => {
                const email = row.getValue();
                return email ? <a className="text-blue-600 hover:underline text-sm" href={`mailto:${email}`}>{email}</a> : <span className="text-xs text-gray-500">N/A</span>;
             }
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
         {
             accessorKey: 'number', // or 'npi'
             header: 'NPI',
             size: 120,
         },
        // Add a 'Remove from List' action column here if needed later
    ], []); // Dependency array is empty unless columns depend on external state specific to this view

    const table = useMaterialReactTable({
        columns,
        data: listProviders, // Data specific to this list
        enableRowSelection: false, // Disable selection unless needed for actions like 'Remove'
        paginationDisplayMode: 'pages',
        initialState: { density: 'compact', pagination: { pageSize: 15, pageIndex: 0 } },
         // Display loading overlay if data is loading for this specific list view
         state: { showProgressBars: isLoading },


        renderTopToolbarCustomActions: () => (
            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', p: 1 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {listDetails?.name || 'List Details'} ({listProviders?.length || 0} Providers)
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudDownload />}
                    onClick={handleDownloadListCsv}
                    disabled={!listProviders || listProviders.length === 0 || isLoading}
                >
                    Export This List
                </Button>
            </Box>
        ),
         // Optionally, show a message if the list is empty and not loading
         renderEmptyRowsFallback: () => (
             <Box sx={{ textAlign: 'center', p: 4 }}>
                 <Typography color="text.secondary">
                     {isLoading ? 'Loading providers...' : 'This list is currently empty.'}
                 </Typography>
             </Box>
         ),
    });

    return <MaterialReactTable table={table} />;
    // return (
    //     <Box sx={{ p: 2, borderRadius: 1, backgroundColor: 'background.paper', boxShadow: 1 }}>
           
    //        ZYZS
    //     </Box>
    // );
};

export default ListView;