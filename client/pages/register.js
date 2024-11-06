import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../config/axios';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    citizenship: '',
    preferredLanguage: '',
    covidVaccinated: '',
    address: {
      street: '',
      city: '',
      state: '',
      postcode: ''
    }
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const languages = ['English', 'Mandarin', 'Hindi', 'Spanish', 'Arabic'];
  const vaccinationStatus = ['Yes', 'No', 'Prefer not to say'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (parseInt(formData.age) < 18) {
      setError('You must be 18 or older to register');
      return;
    }
    try {
      const response = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                name="age"
                type="number"
                required
                min="18"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country of Citizenship
              </label>
              <input
                name="citizenship"
                type="text"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.citizenship}
                onChange={handleChange}
              />
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  name="address.street"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.address.street}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    name="address.city"
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.address.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    name="address.state"
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.address.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postcode
                </label>
                <input
                  name="address.postcode"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.address.postcode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language
              </label>
              <select
                name="preferredLanguage"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.preferredLanguage}
                onChange={handleChange}
              >
                <option value="">Select a language</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                COVID-19 Vaccination Status
              </label>
              <select
                name="covidVaccinated"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.covidVaccinated}
                onChange={handleChange}
              >
                <option value="">Select status</option>
                {vaccinationStatus.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Register
            </button>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 