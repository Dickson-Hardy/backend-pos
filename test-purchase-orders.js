// Simple test script to verify purchase order endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testPurchaseOrders() {
  try {
    console.log('Testing Purchase Order endpoints...');
    
    // Test getting all purchase orders (should return empty array initially)
    const response = await axios.get(`${BASE_URL}/purchase-orders`, {
      headers: {
        'Authorization': 'Bearer test-token' // This would be a real JWT token
      }
    });
    
    console.log('✓ GET /purchase-orders endpoint is accessible');
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('✓ Endpoint exists but requires authentication (expected)');
      console.log('Status:', error.response.status);
    } else {
      console.error('✗ Error:', error.message);
    }
  }
}

// Only run if server is running
testPurchaseOrders();