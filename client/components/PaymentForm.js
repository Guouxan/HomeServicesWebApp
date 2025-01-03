import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from '../config/axios';
import { useRouter } from 'next/router';

const PaymentForm = ({ serviceId, packageId, amount, date, time }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (stripe && elements) {
      setReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError('Payment system is not ready. Please try again.');
      setProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to complete the payment.');
        setProcessing(false);
        return;
      }

      // Create payment intent
      const { data: intentData } = await axios.post(
        'http://localhost:5000/api/payments/create-payment-intent',
        { 
          amount,
          serviceId: serviceId || null,
          packageId: packageId || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setError(null);
        setSucceeded(true);
        
        // Create or update booking
        try {
          const bookingData = {
            serviceId: serviceId || null,
            packageId: packageId || null,
            status: 'confirmed',
            paymentStatus: 'paid',
            dateTime: `${date}T${time}`,
            totalPrice: amount
          };

          console.log('Sending booking update:', bookingData);

          const response = await axios.post(
            'http://localhost:5000/api/bookings/update-status',
            bookingData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log('Booking response:', response.data);

          // Redirect to dashboard after successful payment
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } catch (error) {
          console.error('Error updating booking status:', error);
          setError('Payment successful but booking update failed. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(error.response?.data?.message || 'An error occurred during payment.');
    }
    setProcessing(false);
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        padding: "16px",
        "::placeholder": {
          color: "#32325d"
        },
        backgroundColor: "white"
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 border rounded-md shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border rounded-md bg-white">
          <CardElement options={cardStyle} className="p-2" />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {succeeded && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Payment successful! Your booking has been confirmed. Redirecting to dashboard...
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${(!stripe || processing || succeeded) 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        <span className="flex items-center">
          {processing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : succeeded ? (
            'Payment Completed'
          ) : (
            `Pay $${amount}`
          )}
        </span>
      </button>

      {/* Test card information */}
      <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
        <p className="font-medium mb-2">Test Card Information:</p>
        <ul className="space-y-1">
          <li>Card number: 4242 4242 4242 4242</li>
          <li>Expiry date: Any future date</li>
          <li>CVC: Any 3 digits</li>
          <li>ZIP: Any 5 digits</li>
        </ul>
      </div>
    </form>
  );
};

export default PaymentForm;
