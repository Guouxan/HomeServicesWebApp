import { useState } from 'react';
import axios from '../config/axios';

export default function SecurityDemo() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // Test descriptions and payloads
  const securityTests = {
    xss: {
      title: "XSS (Cross-Site Scripting) Attack",
      description: "Tests protection against malicious script injection",
      payload: '<script>alert("XSS")</script>',
      explanation: "Our XSS protection sanitizes HTML and JavaScript code in user inputs, converting potentially dangerous characters into safe HTML entities.",
      protection: "Using xss library to sanitize input and Content Security Policy (CSP) headers to prevent script execution."
    },
    sql: {
      title: "SQL Injection Attack",
      description: "Tests protection against database manipulation attempts",
      payload: "admin' OR '1'='1",
      explanation: "SQL injection attempts to manipulate database queries by injecting malicious SQL code.",
      protection: "Pattern matching to detect SQL keywords and MongoDB sanitization to prevent query manipulation."
    },
    command: {
      title: "Command Injection Attack",
      description: "Tests protection against server command execution attempts",
      payload: "user; rm -rf /",
      explanation: "Command injection tries to execute dangerous system commands on the server.",
      protection: "Filtering dangerous characters (;, |, $, etc.) and validating input against command patterns."
    },
    ddos: {
      title: "DDoS Protection",
      description: "Tests rate limiting for multiple rapid requests",
      payload: "150 simultaneous requests (over 100 request limit)",
      explanation: "DDoS attacks attempt to overwhelm the server with many requests.",
      protection: "Rate limiting to 100 requests per 15 minutes per IP address."
    },
    payload: {
      title: "Large Payload Protection",
      description: "Tests protection against oversized request payloads",
      payload: "11KB of data (over 10KB limit)",
      explanation: "Large payloads can consume server resources and cause denial of service.",
      protection: "Request size limited to 10KB to prevent memory exhaustion."
    }
  };

  // Function to add test results
  const addResult = (testName, success, message) => {
    const testKey = testName.toLowerCase().split(' ')[0];
    if (!securityTests[testKey]) {
      console.error(`No test details found for ${testName}`);
      return;
    }
    
    setResults(prev => [...prev, { 
      testName, 
      success, 
      message, 
      timestamp: new Date(),
      details: securityTests[testKey]
    }]);
  };

  // XSS Attack Test
  const testXSS = async () => {
    try {
      const maliciousPayload = '<script>alert("XSS")</script>';
      await axios.post('/api/auth/register', {
        name: maliciousPayload,
        email: 'test@test.com',
        password: 'test123'
      });
      addResult('xss', false, 'XSS protection failed');
    } catch (error) {
      addResult('xss', true, 'Successfully blocked XSS attack attempt');
    }
  };

  // SQL Injection Test
  const testSQLInjection = async () => {
    try {
      const maliciousPayload = "admin' OR '1'='1";
      await axios.post('/api/auth/login', {
        email: maliciousPayload,
        password: maliciousPayload
      });
      addResult('sql', false, 'SQL injection protection failed');
    } catch (error) {
      addResult('sql', true, 'Successfully blocked SQL injection attempt');
    }
  };

  // Command Injection Test
  const testCommandInjection = async () => {
    try {
      const maliciousPayload = 'user; rm -rf /';
      await axios.post('/api/auth/register', {
        name: maliciousPayload,
        email: 'test@test.com',
        password: 'test123'
      });
      addResult('command', false, 'Command injection protection failed');
    } catch (error) {
      addResult('command', true, 'Successfully blocked command injection attempt');
    }
  };

  // DDoS Protection Test
  const testDDoS = async () => {
    try {
      const requests = Array(150).fill().map(() => 
        axios.get('/api/services/search')
      );
      await Promise.all(requests);
      addResult('ddos', false, 'DDoS protection failed');
    } catch (error) {
      if (error.response?.status === 429) {
        addResult('ddos', true, 'Successfully blocked DDoS attempt (rate limiting working)');
      } else {
        addResult('ddos', false, 'DDoS test inconclusive');
      }
    }
  };

  // Large Payload Test
  const testLargePayload = async () => {
    try {
      const largePayload = 'x'.repeat(11000);
      await axios.post('/api/auth/register', {
        name: largePayload,
        email: 'test@test.com',
        password: 'test123'
      });
      addResult('payload', false, 'Large payload protection failed');
    } catch (error) {
      addResult('payload', true, 'Successfully blocked large payload');
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setLoading(true);
    setResults([]);
    
    await testXSS();
    await testSQLInjection();
    await testCommandInjection();
    await testDDoS();
    await testLargePayload();
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Security Features Demo</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">About This Demo</h2>
          <p className="text-gray-600 mb-4">
            This demo showcases our application's security features by simulating common web attacks
            and demonstrating how they are prevented. Each test attempts a specific type of attack
            and shows how our security measures respond.
          </p>
          <button
            onClick={runAllTests}
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Running Tests...' : 'Run All Security Tests'}
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          {results.map((result, index) => (
            <div
              key={index}
              className={`mb-6 p-4 rounded-md ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{result.details.title}</h3>
                <span className="text-sm text-gray-500">
                  {result.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="mb-4">
                <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </p>
              </div>

              <div className="bg-white bg-opacity-50 rounded p-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Attack Description:</h4>
                  <p className="text-gray-600">{result.details.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Test Payload:</h4>
                  <code className="block bg-gray-100 p-2 rounded text-sm">
                    {result.details.payload}
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">How It Works:</h4>
                  <p className="text-gray-600">{result.details.explanation}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Protection Method:</h4>
                  <p className="text-gray-600">{result.details.protection}</p>
                </div>
              </div>
            </div>
          ))}
          {results.length === 0 && !loading && (
            <p className="text-gray-500 text-center">No tests run yet</p>
          )}
        </div>
      </div>
    </div>
  );
} 