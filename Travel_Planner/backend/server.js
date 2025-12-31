require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Trip = require('./models/Trip');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travel_planner', {
  // options like useNewUrlParser are no longer needed in newer mongoose versions but harmless
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware to verify token
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Protect middleware: Verifying token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      console.log('Token verified. User ID:', decoded.id);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log('User not found in DB for ID:', decoded.id);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth Not Authorized Error:', error.message);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    console.log('No token provided in headers');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  console.log('📝 Signup request received:', req.body);
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('✅ Creating new user:', email);
    const user = await User.create({ username, email, password });
    console.log('✅ User created successfully:', user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Trip Routes
app.post('/api/trips', protect, async (req, res) => {
  try {
    const trip = new Trip({
      ...req.body,
      user: req.user._id
    });
    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/trips', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ startDate: -1 });

    // Update trip status based on dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let trip of trips) {
      if (trip.status !== 'cancelled') {
        const endDate = new Date(trip.endDate);
        endDate.setHours(0, 0, 0, 0);

        if (endDate < today) {
          trip.status = 'completed';
          await trip.save();
        }
      }
    }

    // Fetch updated trips
    const updatedTrips = await Trip.find({ user: req.user._id }).sort({ startDate: -1 });
    res.json(updatedTrips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/trips/:id/cancel', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    trip.status = 'cancelled';
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
