import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../config/axios';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchBookings(token);
  }, []);

  const fetchBookings = async (token) => {
    try {
      const response = await axios.get('/api/bookings/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching bookings');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              HomeServices
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
              className="text-gray-600 hover:text-blue-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/search"
              className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition"
            >
              Search Services
            </Link>
            <Link
              href="/packages"
              className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition"
            >
              View Service Packages
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {bookings.length === 0 ? (
              <p className="p-4 text-gray-500">No bookings found</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking._id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          {booking.service?.name || booking.servicePackage?.name}
                        </h3>
                        <p className="text-gray-500">
                          {new Date(booking.dateTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: <span className="capitalize">{booking.status}</span>
                        </p>
                      </div>
                      <p className="text-lg font-bold">${booking.totalPrice}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 