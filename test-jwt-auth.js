const jwt = require('jsonwebtoken');

// Test the current token
const testToken = async () => {
  try {
    // Login to get a fresh token
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@pharmpos.com',
        password: 'Admin@2025!'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful, got token');
    
    const token = loginData.access_token;
    console.log('Token preview:', token.substring(0, 50) + '...');
    
    // Decode without verification to see payload
    const decoded = jwt.decode(token, { complete: true });
    console.log('\n📝 Token payload:', {
      header: decoded.header,
      payload: {
        email: decoded.payload.email,
        sub: decoded.payload.sub,
        role: decoded.payload.role,
        iat: decoded.payload.iat,
        exp: decoded.payload.exp,
        issuedAt: new Date(decoded.payload.iat * 1000).toISOString(),
        expiresAt: new Date(decoded.payload.exp * 1000).toISOString()
      }
    });
    
    // Try to verify with the expected JWT secret
    const expectedSecret = 'b3d239e21828cecd1c3cb5f48b0d8e97b4618755623eb53adbd267ff1f905a12781cca98f63dbee1513c66981212658bea8de34fe485228fb0b5a8258745d145';
    
    try {
      const verified = jwt.verify(token, expectedSecret);
      console.log('\n✅ Token verification successful with expected secret');
    } catch (error) {
      console.log('\n❌ Token verification failed with expected secret:', error.message);
      
      // Try with old default secret
      try {
        const verifiedOld = jwt.verify(token, 'pharmacy-pos-secret');
        console.log('\n⚠️  Token was signed with old default secret!');
      } catch (error2) {
        console.log('\n❌ Token verification failed with old secret too:', error2.message);
      }
    }
    
    // Now test the outlets endpoint
    console.log('\n🔍 Testing outlets endpoint...');
    const outletsResponse = await fetch('http://localhost:3001/api/outlets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Outlets response status:', outletsResponse.status);
    
    if (outletsResponse.status === 200) {
      const outletsData = await outletsResponse.json();
      console.log('✅ Outlets endpoint successful:', outletsData.length, 'outlets found');
    } else {
      const errorData = await outletsResponse.text();
      console.log('❌ Outlets endpoint failed:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testToken();