// export const fetchProviders = async (filters = {}) => {
//   const params = new URLSearchParams(filters);

//   const response = await fetch(`https://providers-backend.onrender.com/api/providers?${params.toString()}`);
//   return response.json();
// };


// frontend/src/services/providerService.js
const BASE_URL = 'https://providers-backend.onrender.com/api';
// const BASE_URL = 'http://localhost:8000/api';

const fetchData = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
    }
    return response.json();
};

export const fetchProviders = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const url = `${BASE_URL}/providers?${params.toString()}`;
    return fetchData(url);
};

export const createList = async (listName) => {
    const url = `${BASE_URL}/lists`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listName }),
    };
    return fetchData(url, options);
};

export const addProvidersToList = async (listId, providerNpis) => {
    const url = `${BASE_URL}/lists/${listId}/providers`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ providerNpis }),
    };
    return fetchData(url, options);
};

export const getListProviders = async (listId) => {
    const url = `${BASE_URL}/lists/${listId}/providers`;
    return fetchData(url);
};

export const findEmailForProvider = async (provider) => {
    const url = `${BASE_URL}/providers/${provider.npi}/find-email`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName: provider.basic?.first_name,
            lastName: provider.basic?.last_name,
            organizationName: provider.basic?.organization_name,
        }),
    };
    return fetchData(url, options);
};

export const fetchLists = async () => {
    const url = `${BASE_URL}/lists`;
    return fetchData(url);
};