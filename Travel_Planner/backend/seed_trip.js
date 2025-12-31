
const mongoose = require('mongoose');
const Trip = require('./models/Trip');
const User = require('./models/User');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/travel_planner';

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to MongoDB');

        // 1. Get or Create User
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            user = await User.create({
                username: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        }

        // 2. Create a Trip
        const trip = await Trip.create({
            user: user._id,
            fromCity: 'New Delhi',
            destination: 'Goa',
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 5), // 5 days later
            travelers: 2,
            totalPrice: 25000,
            status: 'upcoming'
        });

        console.log('✅ Trip created successfully!');
        console.log(trip);

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
