# Home Services Web Application

A web application for booking home services with COVID-19 restrictions awareness, built with Next.js, Express, and MongoDB.

## Features

- 🔐 Enhanced User Authentication
  - Comprehensive user registration with:
    - Personal details (name, age, citizenship)
    - Contact information (email, phone)
    - Address details
    - Language preference
    - COVID-19 vaccination status
  - Secure login system
  - JWT-based authentication
  - User profile management
- 🔍 Service Search and Filtering
- 📦 Service Package Booking
- 🏠 Individual Service Booking
- 🦠 COVID-19 Restriction Checking based on Location (Adelaide Suburbs)
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

### Installation (Based on Windows)

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
   - Test different locations in Adelaide suburbs:
     - Lightsview (High risk)
     - Oakden (Medium risk)
     - Magill (Medium risk)
     - Unley (High risk)

### Available Services

1. Cleaning Services:
   - House Cleaning ($80)

2. Plumbing Services:
   - Basic Plumbing ($100)
   - Emergency Plumbing ($180)
   - Drain Cleaning ($120)

3. Electrical Services:
   - Electrical Inspection ($90)
   - Emergency Electrical Repair ($150)

4. Repair & Maintenance:
   - General Home Maintenance ($85)
   - HVAC Service & Repair ($120)
   - Appliance Repair ($95)

### Service Packages

1. Home Starter Package ($130)
   - House Cleaning
   - Garden Maintenance
   - 10% discount

2. Complete Home Care ($220)
   - House Cleaning
   - Basic Plumbing
   - Garden Maintenance
   - 15% discount

3. Home Safety Package ($170)
   - Electrical Inspection
   - Basic Plumbing
   - 12% discount

4. Home Repair Package ($250)
   - General Home Maintenance
   - HVAC Service
   - Appliance Repair
   - 15% discount

### User Registration Fields

The application collects the following information during registration:
- Full Name
- Age (must be 18 or older)
- Country of Citizenship
- Email Address
- Phone Number
- Full Address (street, city, state, postcode)
- Preferred Language (English, Mandarin, Hindi, Spanish, Arabic)
- COVID-19 Vaccination Status
- Secure Password

### Authentication Flow

1. Registration:
   ```bash
   POST /api/auth/register
   # Required fields in request body:
   {
     "name": "string",
     "email": "string",
     "phone": "string",
     "password": "string",
     "age": "number",
     "citizenship": "string",
     "preferredLanguage": "string",
     "covidVaccinated": "string",
     "address": {
       "street": "string",
       "city": "string",
       "state": "string",
       "postcode": "string"
     }
   }
   ```

2. Login:
   ```bash
   POST /api/auth/login
   # Required fields in request body:
   {
     "email": "string",
     "password": "string"
   }
   ```

3. Get User Profile:
   ```bash
   GET /api/auth/profile
   # Requires Authorization header with JWT token
   ```

## Project Structure

```
HomeServicesWebApp/
├── client/                 # Frontend application
│   ├── components/        # React components
│   ├── pages/            # Next.js pages
│   ├── styles/           # CSS styles
│   └── utils/            # Utility functions
├── server/                # Backend application
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── .env                  # Server environment variables
└── package.json         # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Features

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Session management
- Role-based access control

### Protection Against Common Attacks
1. **XSS (Cross-Site Scripting) Protection**
   - Input sanitization for all user inputs
   - Content Security Policy (CSP) headers
   - Special handling for password fields
   - HTML encoding for dynamic content

2. **DDoS Protection**
   - Rate limiting (100 requests per 15 minutes)
   - Request size limitations (10kb)
   - IP-based request tracking
   - Automatic blocking of suspicious IPs

3. **SQL/NoSQL Injection Protection**
   - MongoDB query sanitization
   - Input validation and sanitization
   - Parameterized queries
   - Pattern matching for SQL commands

4. **MITM (Man-in-the-Middle) Protection**
   - Secure headers implementation
   - HTTPS enforcement
   - CORS configuration
   - Content Security Policy

5. **Command Injection Protection**
   - Dangerous character filtering
   - Input validation
   - Pattern matching
   - Error handling

### Security Middleware Implementation
```javascript
// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// XSS Protection
app.use(xssProtection);

// SQL Injection Protection
app.use(sqlInjectionProtection);

// Command Injection Protection
app.use(commandInjectionProtection);
```

### Recent Bug Fixes
1. Fixed authentication middleware ordering
   - Proper order of middleware execution
   - Correct handling of request body parsing
   - Fixed token validation

2. Fixed XSS protection in form submissions
   - Special handling for password fields
   - Proper sanitization of nested objects
   - Fixed input validation

3. Fixed registration validation
   - Age verification
   - Email uniqueness check
   - Password confirmation
   - Required field validation

4. Fixed security headers
   - Updated Content Security Policy
   - Added proper CORS headers
   - Fixed HTTPS redirect
   - Added XSS protection headers

### Security Best Practices
1. Environment Variables
   - Sensitive data stored in .env files
   - Different configurations for development/production
   - Secure key management

2. Error Handling
   - Custom error messages
   - Sanitized error responses
   - Proper logging
   - Development/Production error differentiation

3. Input Validation
   - Server-side validation
   - Client-side validation
   - Type checking
   - Size limitations

4. Access Control
   - Route protection
   - Resource authorization
   - Role-based access
   - Session management


