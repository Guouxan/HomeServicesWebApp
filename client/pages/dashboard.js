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
      const response = await axios.get('http://localhost:5000/api/bookings/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching bookings');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/bookings/update-status',
        {
          bookingId,
          status: 'cancelled',
          paymentStatus: 'refunded'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setError('');
      console.log('Cancellation successful:', response.data);
      
      fetchBookings(token);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError(error.response?.data?.message || 'Failed to cancel booking');
      
      setTimeout(() => {
        setError('');
      }, 3000);
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
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium">
                          {booking.serviceName || 'Unnamed Service'}
                        </h3>
                        <p className="text-gray-500">
                          {new Date(booking.dateTime).toLocaleString()}
                        </p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                              booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              booking.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-lg font-bold">${booking.totalPrice}</p>
                        {booking.covidRestrictions && (
                          <p className="text-sm text-red-600 mt-1 mb-2">
                            {booking.covidRestrictions}
                          </p>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
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