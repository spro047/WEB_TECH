
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/travel_planner';
console.log('Attempting to connect to:', uri);

mongoose.connect(uri)
    .then(async () => {
        console.log('✅ Connected successfully!');

        const db = mongoose.connection.db;

        // List Users
        const usersCollection = db.collection('users');
        const userCount = await usersCollection.countDocuments();
        const users = await usersCollection.find().toArray();
        console.log(`\nFound ${userCount} users:`);
        console.log(users);

        // List Trips
        const tripsCollection = db.collection('trips');
        const tripCount = await tripsCollection.countDocuments();
        const trips = await tripsCollection.find().toArray();
        console.log(`\nFound ${tripCount} trips:`);
        console.log(trips);

        // List all databases to compare
        const admin = mongoose.connection.getClient().db().admin();
        const dbs = await admin.listDatabases();
        console.log('\nAll Databases on this server:');
        dbs.databases.forEach(db => console.log(` - ${db.name}`));

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Connection failed:', err);
    });
