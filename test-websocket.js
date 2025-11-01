// Simple WebSocket test script
// Run with: node test-websocket.js

const io = require('socket.io-client');

const SOCKET_URL = 'http://localhost:3001';
const TEST_OUTLET_ID = '507f1f77bcf86cd799439011'; // Replace with actual outlet ID

console.log('🔌 Connecting to WebSocket server...');
console.log(`URL: ${SOCKET_URL}`);

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
});

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  console.log(`Socket ID: ${socket.id}`);
  
  // Join outlet room
  console.log(`\n📍 Joining outlet room: ${TEST_OUTLET_ID}`);
  socket.emit('join-outlet', TEST_OUTLET_ID);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from WebSocket server');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

// Listen for all events
socket.onAny((eventName, ...args) => {
  console.log(`\n📨 Event received: ${eventName}`);
  console.log('Data:', JSON.stringify(args, null, 2));
});

// Listen for specific events
socket.on('sale:completed', (data) => {
  console.log('\n💰 Sale completed!');
  console.log('Sale ID:', data.saleId);
  console.log('Total:', data.total);
  console.log('Items:', data.items?.length || 0);
});

socket.on('inventory:updated', (data) => {
  console.log('\n📦 Inventory updated!');
  console.log('Product ID:', data.productId);
  console.log('New Stock:', data.stockQuantity);
});

socket.on('transfer:completed', (data) => {
  console.log('\n🚚 Transfer completed!');
  console.log('Transfer ID:', data.transferId);
});

console.log('\n👂 Listening for events...');
console.log('Press Ctrl+C to exit\n');

// Keep the script running
process.on('SIGINT', () => {
  console.log('\n\n👋 Closing connection...');
  socket.disconnect();
  process.exit(0);
});
