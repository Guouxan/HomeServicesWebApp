# Home Services Web Application

A web application for booking home services with COVID-19 restrictions awareness, built with Next.js, Express, and MongoDB.

## Features

- 🔐 User Authentication (Register/Login)
- 🔍 Service Search and Filtering
- 📦 Service Package Booking
- 🏠 Individual Service Booking
- 🦠 COVID-19 Restriction Checking based on Location
- 💳 Secure Payment Processing with Stripe
- 📱 Responsive Design
- 📊 Booking Management Dashboard

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment**: Stripe
- **Testing**: Jest

## Getting Started

### Prerequisites

1. Node.js (v14 or higher)
   - Download and install from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. MongoDB
   - Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Start MongoDB service
   - Verify installation: `mongod --version`

3. Stripe Account
   - Sign up at [stripe.com](https://stripe.com)
   - Get your API keys from the Stripe Dashboard
   - Keep both Publishable and Secret keys handy

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Guouxan/HomeServicesWebApp.git
   cd HomeServicesWebApp
   ```

2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. Set up environment variables:

   Create `.env` file in the root directory:
   ```bash
   # Server Configuration
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/home_services_app

   # Authentication
   JWT_SECRET=your_jwt_secret_here

   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

   Create `.env.local` file in the client directory:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Initialize the database:
   ```bash
   # The database will be automatically seeded when you start the server
   # Make sure MongoDB is running first!
   mongod
   ```

5. Start the development servers:
   ```bash
   # Start both frontend and backend servers
   npm run dev

   # Or start them separately:
   # Backend server
   npm run dev:server

   # Frontend server
   npm run dev:client
   ```

6. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Testing the Application

1. Create a test account:
   - Go to http://localhost:3000/register
   - Fill in the registration form
   - Login with your credentials

2. Test payment processing:
   - Use Stripe test card: 4242 4242 4242 4242
   - Any future expiry date
   - Any 3-digit CVC
   - Any 5-digit postal code

3. Test COVID-19 restrictions:
   - Allow location access when prompted
   - Test different locations in Adelaide suburbs
   - Observe different restriction levels
