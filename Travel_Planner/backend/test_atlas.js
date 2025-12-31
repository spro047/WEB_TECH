
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection to Atlas...');
// Mask password in logs
const uri = process.env.MONGO_URI;
console.log('URI:', uri.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(uri)
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        if (err.message.includes('bad auth')) {
            console.log('   -> Password or Username might be incorrect.');
        } else if (err.message.includes('whitelist') || err.message.includes('timed out')) {
            console.log('   -> Your IP address might not be whitelisted in MongoDB Atlas.');
        }
        process.exit(1);
    });
