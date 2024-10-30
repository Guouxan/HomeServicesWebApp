import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  console.log('Client Environment Check:');
  console.log('Stripe Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  console.log('Stripe Key exists:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return <Component {...pageProps} />;
}

export default MyApp;
