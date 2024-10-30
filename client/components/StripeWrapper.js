import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe('pk_test_51QFWAyAtArK10MBtOjRMMzGWHeH0xPJWPg2ymfNbRlwYnPTPWFb87hdNpbdzbxvX6X4o2bYHQpY0QEfx0SJjlLo800eTDND698');

export default function StripeWrapper({ children }) {
  const options = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0070f3',
      },
    },
  };

  if (!stripePromise) {
    console.error('Stripe failed to initialize');
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
} 