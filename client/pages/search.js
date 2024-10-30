import React, { useState } from 'react';
import axios from '../config/axios';
import Link from 'next/link';

export default function Search() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'cleaning', label: 'Cleaning Services' },
    { value: 'repair', label: 'Repair & Maintenance' },
    { value: 'gardening', label: 'Gardening & Landscaping' },
    { value: 'plumbing', label: 'Plumbing Services' },
    { value: 'electrical', label: 'Electrical Services' }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/services/search?query=${query}&category=${category}`);
      setServices(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              HomeServices
            </Link>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Find Home Services</h1>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Services
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., house cleaning"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : 'Search Services'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{service.name}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">${service.price}</span>
                  <span className="text-sm text-gray-500">{service.duration} mins</span>
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    {service.covidRestrictions}
                  </span>
                </div>
                <Link 
                  href={`/book/${service._id}`}
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {services.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">No services found. Try adjusting your search criteria.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
