//not in use
// This component is not in use. It was created to display provider information in a card format.
import React from 'react';

const ProviderCard = ({ provider }) => {
  const name = `${provider.basic?.name_prefix || ''} ${provider.basic?.first_name || ''} ${provider.basic?.last_name || ''}`.trim();
  const specialty = provider.taxonomies?.find(taxonomy => taxonomy.primary)?.desc || 'N/A';
  const locationAddress = provider.addresses?.find(address => address.address_purpose === 'LOCATION');
  const address = locationAddress?.address_1 || 'N/A';
  const address2 = locationAddress?.address_2 || '';
  const city = locationAddress?.city || 'N/A';
  const state = locationAddress?.state || 'N/A';
  const zip = locationAddress?.postal_code || 'N/A';
  const phone = locationAddress?.telephone_number || 'N/A';
  const email = provider.basic?.email || 'N/A'; // Email is not present in the API response, so this will default to 'N/A'.

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <div className="flex items-center mb-2">
        <h2 className="text-xl font-semibold mr-2">{name}</h2>
        {specialty && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {specialty}
          </span>
        )}
      </div>
      <p className="text-gray-700 mb-1">
        {address}{address2 && `, ${address2}`}, {city}, {state} {zip}
      </p>
      <div className="flex items-center text-sm text-gray-600">
        <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14M5 12h14" />
        </svg>
        <a href={`mailto:${email}`} className="hover:underline text-blue-500">{email}</a>
      </div>
      {phone && (
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1c-1.009 0-1.942-.792-2.006-1.799a4.99 4.99 0 00-2.28 1.786c-.76.337-1.659.48-2.558.48-2.997 0-5.395-2.939-5.395-5.857a9.974 9.974 0 00.502-2.47zm2.2 1h16.6" />
          </svg>
          {phone}
        </div>
      )}
    </div>
  );
};

export default ProviderCard;