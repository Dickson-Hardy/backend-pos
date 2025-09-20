"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('🚀 Test script starting...');
const dotenv = require("dotenv");
dotenv.config();
console.log('📦 Environment loaded');
console.log('🔗 Database URL:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@'));
async function testConnection() {
    try {
        console.log('🧪 Testing basic imports...');
        const { NestFactory } = await Promise.resolve().then(() => require('@nestjs/core'));
        console.log('✅ NestJS imported successfully');
        const { AppModule } = await Promise.resolve().then(() => require('../app.module'));
        console.log('✅ AppModule imported successfully');
        console.log('🔗 Creating application context...');
        const app = await NestFactory.createApplicationContext(AppModule);
        console.log('✅ Application context created');
        await app.close();
        console.log('✅ Test completed successfully');
    }
    catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}
testConnection();
//# sourceMappingURL=test-seed.js.map