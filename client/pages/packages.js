import { useState, useEffect } from 'react';
import axios from '../config/axios';
import Link from 'next/link';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/api/services/packages');
      console.log('Packages response:', response.data);
      setPackages(response.data);
    } catch (error) {
      console.error('Error details:', error);
      setError('Error fetching packages');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Service Packages</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">{pkg.name}</h2>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <div className="mb-4">
                <h3 className="font-bold mb-2">Included Services:</h3>
                <ul className="list-disc pl-5">
                  {pkg.services.map((service, index) => (
                    <li key={index}>
                      {service.service.name} x{service.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-lg font-bold text-blue-600 mb-4">
                ${pkg.price}
                {pkg.discount > 0 && (
                  <span className="text-green-500 ml-2">
                    ({pkg.discount}% off)
                  </span>
                )}
              </p>
              <Link
                href={`/book/package/${pkg._id}`}
                className="block text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Book Package
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 