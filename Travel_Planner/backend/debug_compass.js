
const mongoose = require('mongoose');
require('dotenv').config();

// Force localhost for this check to match User's Compass
const uri = 'mongodb://localhost:27017/travel_planner';

console.log('---------------------------------------------------');
console.log('DIAGNOSTIC SCRIPT RUNNING');
console.log('Target URI:', uri);
console.log('---------------------------------------------------');

mongoose.connect(uri)
    .then(async () => {
        console.log('✅ Connected successfully to Localhost!');

        const admin = mongoose.connection.getClient().db().admin();
        const dbs = await admin.listDatabases();

        console.log('\n📂 DATABASES FOUND ON LOCALHOST:');
        dbs.databases.forEach(db => {
            console.log(` - ${db.name} (${db.sizeOnDisk} bytes)`);
        });

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log(`\n📂 COLLECTIONS IN 'travel_planner':`);
        if (collections.length === 0) {
            console.log('   (No collections found - database might be empty)');
        } else {
            collections.forEach(c => console.log(` - ${c.name}`));
        }

        // Check counts
        const userCount = await db.collection('users').countDocuments();
        const tripCount = await db.collection('trips').countDocuments();

        console.log('\n📊 DATA COUNTS:');
        console.log(` - Users: ${userCount}`);
        console.log(` - Trips: ${tripCount}`);

        if (userCount === 0 && tripCount === 0) {
            console.log('\n⚠️ NO DATA FOUND! Attempting to insert test data now...');
            await db.collection('users').insertOne({
                username: 'Compass Test',
                email: 'compass@test.com',
                createdAt: new Date()
            });
            console.log('✅ Inserted 1 User: compass@test.com');
        }

        console.log('---------------------------------------------------');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.log('   -> This means MongoDB is NOT running on localhost:27017');
        }
    });
