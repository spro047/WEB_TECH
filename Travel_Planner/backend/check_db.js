
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/travel_planner';

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to MongoDB via seed script');

        // Check if user exists
        const email = 'test@example.com';
        let user = await User.findOne({ email });

        if (user) {
            console.log('Test user already exists:', user);
        } else {
            user = await User.create({
                username: 'Test User',
                email: email,
                password: 'password123'
            });
            console.log('Created test user:', user);
        }

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Current Collections:', collections.map(c => c.name));

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
