import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../../../config/axios';
import PaymentForm from '../../../components/PaymentForm';
import StripeWrapper from '../../../components/StripeWrapper';

const BookPackage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [servicePackage, setServicePackage] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableTimeSlots, setAvailableTimeSlots] = useState({});

  useEffect(() => {
    if (id) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    try {
      const response = await axios.get(`/api/services/packages/${id}`);
      setServicePackage(response.data);
      setAvailableTimeSlots(response.data.availableSlots || {});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching package:', error);
      setError('Error fetching package details');
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        '/api/services/packages/book',
        { packageId: id, date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Package booking successful! Proceeding to payment...');
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed');
    }
  };

  // Update the date selection to reset time
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setTime(''); // Reset time when date changes
  };

  // Get available times for selected date
  const getAvailableTimesForDate = (selectedDate) => {
    return availableTimeSlots[selectedDate] || [];
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!servicePackage) return <div className="min-h-screen flex items-center justify-center">Package not found</div>;

  const finalPrice = servicePackage.price * (1 - servicePackage.discount / 100);
  const availableTimes = date ? getAvailableTimesForDate(date) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book {servicePackage.name}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Package Details</h2>
            <p className="text-gray-600 mb-4">{servicePackage.description}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Included Services:</h3>
              <ul className="list-disc pl-5">
                {servicePackage.services.map((service, index) => (
                  <li key={index} className="text-gray-600">
                    {service.service.name} x{service.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <p className="font-bold mb-2">
              Price: ${servicePackage.price}
              {servicePackage.discount > 0 && (
                <span className="text-green-600 ml-2">
                  ({servicePackage.discount}% off - Final Price: ${finalPrice})
                </span>
              )}
            </p>
            <p className="text-sm text-gray-600">Duration: {servicePackage.duration} minutes</p>
            <p className="text-sm text-red-600">Covid-19 Restrictions: {servicePackage.covidRestrictions}</p>
          </div>

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((timeSlot) => (
                    <option key={timeSlot} value={timeSlot}>
                      {timeSlot}
                    </option>
                  ))}
                </select>
                {availableTimes.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    No available time slots for this date
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              disabled={!date || !time}
            >
              Book Package
            </button>
          </form>
        </div>

        {success && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <StripeWrapper>
              <PaymentForm 
                serviceId={id} 
                amount={finalPrice} 
                date={date}
                time={time}
              />
            </StripeWrapper>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPackage;