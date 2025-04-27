import React from 'react';
import { useLocation } from 'react-router-dom';

const ProviderDetailPage = () => {
    const location = useLocation();
    const providerData = location.state;

    if (!providerData) {
        return <div className="p-4">Provider data not found.</div>;
    }

    const { basic, addresses, taxonomies, number, enumeration_type, identifiers, endpoints, other_names } = providerData;

    const locationAddress = addresses?.find(a => a.address_purpose === 'LOCATION');
    const mailingAddress = addresses?.find(a => a.address_purpose === 'MAILING');

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto mt-8">
            <div className="flex items-center justify-between mb-4 border-b pb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {basic?.name_prefix} {basic?.first_name} {basic?.last_name} {basic?.credential}
                </h2>
                <div className="text-gray-600">NPI: {number || providerData.npi}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Basic Information */}
                <div>
                    <h3 className="text-lg font-semibold text-indigo-700 mb-2">Basic Information</h3>
                    <div className="mb-2">
                        <strong className="text-gray-700">Enumeration Type:</strong> <span className="text-gray-600">{enumeration_type}</span>
                    </div>
                    <div className="mb-2">
                        <strong className="text-gray-700">Gender:</strong> <span className="text-gray-600">{basic?.sex || 'N/A'}</span>
                    </div>
                    <div className="mb-2">
                        <strong className="text-gray-700">Sole Proprietor:</strong> <span className="text-gray-600">{basic?.sole_proprietor || 'N/A'}</span>
                    </div>
                    <div className="mb-2">
                        <strong className="text-gray-700">Enumeration Date:</strong> <span className="text-gray-600">{basic?.enumeration_date || 'N/A'}</span>
                    </div>
                    <div className="mb-2">
                        <strong className="text-gray-700">Last Updated:</strong> <span className="text-gray-600">{basic?.last_updated || 'N/A'}</span>
                    </div>
                    <div className="mb-2">
                        <strong className="text-gray-700">Certification Date:</strong> <span className="text-gray-600">{basic?.certification_date || 'N/A'}</span>
                    </div>
                    <div className="mb-2">
                        <strong className="text-gray-700">Status:</strong> <span className="text-gray-600">{basic?.status || 'N/A'}</span>
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className="text-lg font-semibold text-indigo-700 mb-2">Contact Information</h3>
                    {locationAddress && (
                        <div className="mb-3 border-b pb-3">
                            <strong className="text-gray-700 block mb-1">Location Address:</strong>
                            <div className="text-gray-600">
                                {locationAddress.address_1}, {locationAddress.address_2 || ''}<br />
                                {locationAddress.city}, {locationAddress.state} {locationAddress.postal_code}<br />
                                <a href={`tel:${locationAddress.telephone_number}`} className="text-blue-600 hover:underline">
                                    {locationAddress.telephone_number}
                                </a>
                                {locationAddress.fax_number && (
                                    <div className="mt-1">Fax: {locationAddress.fax_number}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {mailingAddress && (
                        <div className="mb-3 border-b pb-3">
                            <strong className="text-gray-700 block mb-1">Mailing Address:</strong>
                            <div className="text-gray-600">
                                {mailingAddress.address_1}, {mailingAddress.address_2 || ''}<br />
                                {mailingAddress.city}, {mailingAddress.state} {mailingAddress.postal_code}<br />
                                <a href={`tel:${mailingAddress.telephone_number}`} className="text-blue-600 hover:underline">
                                    {mailingAddress.telephone_number}
                                </a>
                                {mailingAddress.fax_number && (
                                    <div className="mt-1">Fax: {mailingAddress.fax_number}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {basic?.email && (
                        <div className="mt-2">
                            <strong className="text-gray-700">Email:</strong>
                            <p className="text-blue-600 hover:underline">
                                <a href={`mailto:${basic.email}`}>{basic.email}</a>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Taxonomy Information */}
            {taxonomies && taxonomies.length > 0 && (
                <div className="mb-6 border-b pb-4">
                    <h3 className="text-lg font-semibold text-indigo-700 mb-2">Taxonomy Information</h3>
                    {taxonomies.map((taxonomy, index) => (
                        <div key={index} className="mb-3 p-4 bg-indigo-50 rounded-md border border-indigo-200">
                            <div className="mb-1"><strong className="text-indigo-700">Description:</strong> <span className="text-gray-700">{taxonomy.desc}</span></div>
                            <div className="mb-1"><strong className="text-indigo-700">Code:</strong> <span className="text-gray-700">{taxonomy.code}</span></div>
                            <div className="mb-1"><strong className="text-indigo-700">Primary:</strong> <span className="text-gray-700">{taxonomy.primary ? 'Yes' : 'No'}</span></div>
                            <div className="mb-1"><strong className="text-indigo-700">State:</strong> <span className="text-gray-700">{taxonomy.state || 'N/A'}</span></div>
                            <div><strong className="text-indigo-700">License:</strong> <span className="text-gray-700">{taxonomy.license || 'N/A'}</span></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Identifiers */}
            {identifiers && identifiers.length > 0 && (
                <div className="mb-6 border-b pb-4">
                    <h3 className="text-lg font-semibold text-teal-700 mb-2">Other Identifiers</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Issuer
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        State
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Number
                                    </th>
                                    {/* Add more identifier headers if needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {identifiers.map((identifier, index) => (
                                    <tr key={index}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {identifier.issuer || 'N/A'}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {identifier.state || 'N/A'}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {identifier.identifier || 'N/A'}
                                        </td>
                                        {/* Add more identifier data cells if needed */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Endpoints */}
            {endpoints && endpoints.length > 0 && (
                <div className="mb-6 border-b pb-4">
                    <h3 className="text-lg font-semibold text-orange-700 mb-2">Endpoints</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Endpoint Type
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Endpoint
                                    </th>
                                    {/* Add more endpoint headers based on your data structure */}
                                </tr>
                            </thead>
                            <tbody>
                                {endpoints.map((endpoint, index) => (
                                    <tr key={index}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {endpoint.endpoint_type || 'N/A'}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {endpoint.url || endpoint.telephone_number || 'N/A'} {/* Adjust based on your endpoint data */}
                                        </td>
                                        {/* Add more endpoint data cells */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Other Names */}
            {other_names && other_names.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-purple-700 mb-2">Other Names</h3>
                    {other_names.map((otherName, index) => (
                        <div key={index} className="mb-3 p-4 bg-purple-50 rounded-md border border-purple-200">
                            <div className="mb-1"><strong className="text-purple-700">Name:</strong> <span className="text-gray-700">{[otherName.name_prefix, otherName.first_name, otherName.middle_name, otherName.last_name, otherName.name_suffix].filter(Boolean).join(' ') || 'N/A'}</span></div>
                            <div className="mb-1"><strong className="text-purple-700">Type:</strong> <span className="text-gray-700">{otherName.type || 'N/A'}</span></div>
                            <div><strong className="text-purple-700">Last Updated:</strong> <span className="text-gray-700">{otherName.last_updated || 'N/A'}</span></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProviderDetailPage;