// import React, { useState } from 'react';
// import FilterForm from '../components/FilterForm';
// import ProviderCard from '../components/ProviderCard';
// import { fetchProviders } from '../services/providerService';
// import ProviderTable from '../components/ProviderTable';

// const ProviderLeads = () => {
//   const [providers, setProviders] = useState([]);

//   const handleApplyFilters = async (filters) => {
//     const data = await fetchProviders(filters);
//     setProviders(data?.results || []);
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className=" text-blue p-4">
//         <p className="text-center text-lg italic">"A true hero saves lives, one step at a time!"</p>
//       </div>
//       <h1 className="text-3xl font-bold mb-4">Medical Provider Leads</h1>
//       <FilterForm onApply={handleApplyFilters} />
//       {/* <div className="mt-6 space-y-4">
//         {providers.map((provider, index) => (
//           <ProviderCard key={index} provider={provider} />
//         ))}
//       </div> */}
//       <div className="mt-6">
//         <ProviderTable providers={providers} />
//       </div>



//     </div>
//   );
// };

// export default ProviderLeads;

import React, { useState, useCallback } from 'react';
import FilterForm from '../components/FilterForm';
// 1. Import the new parent component
import ProviderManager from '../components/ProviderManager';
import { fetchProviders } from '../services/providerService';

const ProviderLeads = () => {
    const [providers, setProviders] = useState([]);
    // Add loading state for user feedback during fetch
    const [isLoading, setIsLoading] = useState(false);
    // Add error state for user feedback
    const [error, setError] = useState(null);


    const handleApplyFilters = useCallback(async (filters) => {
        setIsLoading(true); // Start loading
        setError(null); // Clear previous errors
        try {
            const data = await fetchProviders(filters);
            setProviders(data?.results || []);
        } catch (err) {
            console.error('Error fetching providers:', err);
            setError('Failed to fetch providers. Please try again.'); // Set error message
            setProviders([]); // Clear providers on error
        } finally {
            setIsLoading(false); // Stop loading regardless of success/failure
        }
    }, []);

    // This callback remains the same, ProviderManager will pass it down
    // to ProviderSearchTable where it's needed (e.g., after finding email)
    const handleProvidersUpdated = useCallback((updatedProviders) => {
        setProviders(updatedProviders);
    }, []);

    return (
        <div className="p-4 md:p-6 max-w-full mx-auto"> {/* Use max-w-full for better space utilization */}
            {/* Optional: Removed the quote div for cleaner look, or keep if desired */}
            {/* <div className=" text-blue p-4">
                <p className="text-center text-lg italic">"A true hero saves lives, one step at a time!"</p>
            </div> */}

            {/* <h1 className="text-2xl md:text-3xl font-bold mb-4">Medical Provider Leads</h1> */}

            <FilterForm onApply={handleApplyFilters} isLoading={isLoading} />

            <div className="mt-6">
                {/* Render loading indicator */}
                {isLoading && <div className="text-center p-4">Loading providers...</div>}

                {/* Render error message */}
                {error && <div className="text-center p-4 text-red-600">{error}</div>}

                {/* 2. Render ProviderManager instead of ProviderTable */}
                {/* Pass the fetched providers as 'initialProviders' */}
                {!isLoading && !error && ( // Only render manager when not loading and no error
                    <ProviderManager
                        initialProviders={providers}
                        onProvidersUpdated={handleProvidersUpdated}
                        // No need to pass showSnackbar from here anymore, ProviderManager handles its own
                    />
                )}
            </div>
        </div>
    );
};

export default ProviderLeads;