import React, { useState } from 'react';

const specialties = ['Cardiology', 'Internal Medicine', 'Family Medicine', 'Neurology', 'Orthopedic Surgery'];
const states = ['NY', 'CA', 'TX', 'FL', 'IL', 'MA', 'PA', 'OH'];
const providerTypes = ['NPI-1', 'NPI-2'];
const addressTypes = ['LOCATION', 'MAILING', 'PRIMARY', 'SECONDARY'];

const FilterForm = ({ onApply }) => {
  const [filters, setFilters] = useState({
    taxonomy_description: '',
    state: '',
    enumeration_type: '',
    address_purpose: '',
    first_name: '',
    last_name: '',
    organization_name: '',
    city: '',
    postal_code: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-md shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Row 1 */}
      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
        <select
          id="specialty"
          name="taxonomy_description"
          onChange={handleChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select Specialties</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <select
          id="location"
          name="state"
          onChange={handleChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select States</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="enumeration_type" className="block text-sm font-medium text-gray-700">Provider Type</label>
        <select
          id="enumeration_type"
          name="enumeration_type"
          onChange={handleChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {providerTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="address_purpose" className="block text-sm font-medium text-gray-700">Address Type</label>
        <select
          id="address_purpose"
          name="address_purpose"
          onChange={handleChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {addressTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Row 2 */}
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          name="first_name"
          id="first_name"
          placeholder="First Name"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          name="last_name"
          id="last_name"
          placeholder="Last Name"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700">Organization Name</label>
        <input
          type="text"
          name="organization_name"
          id="organization_name"
          placeholder="Organization Name"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="Enter city"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">ZIP Code</label>
        <input
          type="text"
          name="postal_code"
          id="postal_code"
          placeholder="Enter ZIP"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          onChange={handleChange}
        />
      </div>

      {/* Row 3 - Buttons and Selected Filters */}
      <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
        >
          Apply Filters
        </button>
        <div className="flex items-center space-x-2">
          {filters.taxonomy_description && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2 py-0.5">
              {filters.taxonomy_description}
            </span>
          )}
          {filters.state && (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium rounded-full px-2 py-0.5">
              {filters.state}
            </span>
          )}
          {filters.first_name && (
            <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full px-2 py-0.5">
              {filters.first_name}
            </span>
          )}
          {filters.last_name && (
            <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full px-2 py-0.5">
              {filters.last_name}
            </span>
          )}
          {filters.organization_name && (
            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs font-medium rounded-full px-2 py-0.5">
              {filters.organization_name}
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full px-2 py-0.5">
              {filters.city}
            </span>
          )}
          {filters.postal_code && (
            <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium rounded-full px-2 py-0.5">
              {filters.postal_code}
            </span>
          )}
          {filters.enumeration_type !== providerTypes[0] && (
            <span className="inline-flex items-center bg-teal-100 text-teal-800 text-xs font-medium rounded-full px-2 py-0.5">
              {filters.enumeration_type}
            </span>
          )}
          {filters.address_purpose !== addressTypes[0] && (
            <span className="inline-flex items-center bg-lime-100 text-lime-800 text-xs font-medium rounded-full px-2 py-0.5">
              {filters.address_purpose}
            </span>
          )}
        </div>
      </div>
    </form>
  );
};

export default FilterForm;