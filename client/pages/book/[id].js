import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../../config/axios';
import PaymentForm from '../../components/PaymentForm';
import StripeWrapper from '../../components/StripeWrapper';
import CovidCheck from '../../components/CovidCheck';

const BookService = () => {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [covidRestrictions, setCovidRestrictions] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState({});

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await axios.get(`/api/services/${id}`);
      const serviceData = response.data;
      
      // Format available dates and times
      const slots = serviceData.availableDates.reduce((acc, date) => {
        const dateStr = new Date(date).toISOString().split('T')[0];
        const timeStr = new Date(date).toTimeString().slice(0, 5);
        
        if (!acc[dateStr]) {
          acc[dateStr] = [];
        }
        if (!acc[dateStr].includes(timeStr)) {
          acc[dateStr].push(timeStr);
        }
        return acc;
      }, {});

      setService(serviceData);
      setAvailableTimeSlots(slots);
      setLoading(false);
    } catch (error) {
      setError('Error fetching service details');
      setLoading(false);
    }
  };

  const handleRestrictionCheck = (restrictions) => {
    setCovidRestrictions(restrictions);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setTime(''); // Reset time when date changes
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      if (covidRestrictions?.inHotZone && covidRestrictions?.riskLevel === 'high') {
        setError('Booking not available in high-risk areas');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post('/api/services/book', 
        { serviceId: id, date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Booking successful! Proceeding to payment...');
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center">Service not found</div>;

  const availableTimes = date ? availableTimeSlots[date] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book {service.name}</h1>
        
        <CovidCheck service={service} onRestrictionCheck={handleRestrictionCheck} />

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
            <h2 className="text-xl font-semibold mb-2">Service Details</h2>
            <p className="text-gray-600 mb-2">{service.description}</p>
            <p className="font-bold">Price: ${service.price}</p>
            <p className="text-sm text-gray-600">Duration: {service.duration} minutes</p>
            <p className="text-sm text-red-600">Covid-19 Restrictions: {service.covidRestrictions}</p>
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
              Book Now
            </button>
          </form>
        </div>

        {success && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <StripeWrapper>
              <PaymentForm serviceId={id} amount={service.price} date={date} time={time} />
            </StripeWrapper>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookService;
