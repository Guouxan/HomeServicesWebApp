import axios from '../../../config/axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  try {
    const response = await axios.post('/api/bookings/create', req.body, {
      headers: { Authorization: authHeader }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.message || 'Error creating booking' 
    });
  }
} 