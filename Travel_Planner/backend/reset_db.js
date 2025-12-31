
const mongoose = require('mongoose');

// Use 127.0.0.1 explicitly to avoid IPv6/IPv4 confusion
const uri = 'mongodb://127.0.0.1:27017/travel_planner';

console.log('Connecting to:', uri);

mongoose.connect(uri)
    .then(async () => {
        console.log('✅ Connected!');

        const db = mongoose.connection.db;

        // 1. Drop the database to clear stale state/confusion
        console.log('💥 DROPPING database `travel_planner`...');
        await db.dropDatabase();
        console.log('   Database dropped.');

        // 2. Insert fresh data
        console.log('🌱 Inserting FRESH data...');

        await db.collection('users').insertOne({
            username: 'Fresh User',
            email: 'fresh@test.com',
            note: 'If you see this, you are connected to the right DB!',
            createdAt: new Date()
        });

        await db.collection('trips').insertOne({
            destination: 'VICTORY LAP',
            status: 'confirmed',
            note: 'This trip proves connection works',
            totalPrice: 999999,
            createdAt: new Date()
        });

        console.log('✅ Data inserted successfully.');
        console.log('   Users: 1');
        console.log('   Trips: 1');

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
