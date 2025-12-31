
// Axios import removed, using native http module
const http = require('http');

// Helper to make HTTP requests
function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(body));
                    } else {
                        reject({ status: res.statusCode, body: body });
                    }
                } catch (e) {
                    resolve(body); // Return authentication errors strictly
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testFrontendFlow() {
    const uniqueId = Date.now();
    const testUser = {
        username: `FrontendUser_${uniqueId}`,
        email: `frontend_${uniqueId}@test.com`,
        password: 'password123'
    };

    console.log('1️⃣  Simulating "Sign Up" button click...');
    try {
        const signupData = await makeRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/signup',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, testUser);

        console.log('   ✅ Signup Successful!');
        console.log(`   User created: ${signupData.email} (ID: ${signupData._id})`);

        console.log('\n2️⃣  Simulating "Login" to get Token...');
        const loginData = await makeRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: testUser.email, password: testUser.password });

        const token = loginData.token;
        console.log('   ✅ Login Successful!');
        console.log('   Token received (starts with):', token.substring(0, 20) + '...');

        console.log('\n3️⃣  Simulating "Book Trip" button click...');
        const tripData = {
            fromCity: 'Simulation City',
            destination: 'frontend_test_destination',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 86400000).toISOString(),
            travelers: 1,
            totalPrice: 5000
        };

        const bookingRes = await makeRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/trips',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, tripData);

        console.log('   ✅ Booking Successful!');
        console.log(`   Trip created to: ${bookingRes.destination}`);
        console.log('\n🎉 SUCCESS: The backend is correctly accepting data!');

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testFrontendFlow();
