const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { 
      name, email, phone, password, 
      age, citizenship, preferredLanguage, 
      covidVaccinated, address 
    } = req.body;
    
    // Validate age
    if (parseInt(age) < 18) {
      return res.status(400).json({ message: 'You must be 18 or older to register' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user with all fields
    const user = new User({ 
      name, 
      email, 
      phone, 
      password,
      age,
      citizenship,
      preferredLanguage,
      covidVaccinated,
      address
    });
    await user.save();
    
    // Create token and send response
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        covidVaccinated: user.covidVaccinated
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      message: 'Registration failed', 
      error: error.message,
      details: error.stack
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Return more user information
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        phone: user.phone,
        age: user.age,
        citizenship: user.citizenship,
        preferredLanguage: user.preferredLanguage,
        covidVaccinated: user.covidVaccinated,
        address: user.address
      } 
    });
  } catch (error) {
    res.status(400).json({ message: 'Login failed', error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};
