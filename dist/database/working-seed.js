"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('🚀 Working seed starting...');
const dotenv = require("dotenv");
dotenv.config();
console.log('📦 Environment loaded');
async function testImports() {
    try {
        console.log('🧪 Testing imports...');
        const { NestFactory } = await Promise.resolve().then(() => require('@nestjs/core'));
        console.log('✅ NestJS imported');
        const { AppModule } = await Promise.resolve().then(() => require('../app.module'));
        console.log('✅ AppModule imported');
        const bcrypt = await Promise.resolve().then(() => require('bcrypt'));
        console.log('✅ bcrypt imported');
        const { UserRole, UserStatus } = await Promise.resolve().then(() => require('../schemas/user.schema'));
        console.log('✅ User schema imported');
        const { OutletStatus } = await Promise.resolve().then(() => require('../schemas/outlet.schema'));
        console.log('✅ Outlet schema imported');
        const { ProductCategory, ProductStatus, UnitOfMeasure } = await Promise.resolve().then(() => require('../schemas/product.schema'));
        console.log('✅ Product schema imported');
        const { PaymentMethod, SaleStatus } = await Promise.resolve().then(() => require('../schemas/sale.schema'));
        console.log('✅ Sale schema imported');
        console.log('🏗️ Creating application context...');
        const app = await NestFactory.createApplicationContext(AppModule);
        console.log('✅ Application context created');
        console.log('🧹 Testing password hashing...');
        const hashedPassword = await bcrypt.hash('admin@2025', 10);
        console.log('✅ Password hashed successfully');
        await app.close();
        console.log('✅ All tests passed!');
    }
    catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}
testImports();
//# sourceMappingURL=working-seed.js.map