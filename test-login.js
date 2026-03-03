const http = require('http');

async function testLogin() {
    const loginData = new URLSearchParams();
    loginData.append('username', 'Dian');
    loginData.append('password', 'password123');
    loginData.append('callbackUrl', '/today');
    loginData.append('redirect', 'false'); // Prevents standard redirect so we see JSON

    const res = await fetch('http://localhost:3000/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'next-auth.csrf-token=dummy|dummy;' // bypass if possible or we need a real one
        },
        body: loginData.toString()
    });

    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
}

testLogin().catch(console.error);
