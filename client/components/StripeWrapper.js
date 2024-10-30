import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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