console.log('🚀 Working seed starting...')

import * as dotenv from 'dotenv'
dotenv.config()

console.log('📦 Environment loaded')

async function testImports() {
  try {
    console.log('🧪 Testing imports...')
    
    const { NestFactory } = await import('@nestjs/core')
    console.log('✅ NestJS imported')
    
    const { AppModule } = await import('../app.module')
    console.log('✅ AppModule imported')
    
    const bcrypt = await import('bcrypt')
    console.log('✅ bcrypt imported')
    
    const { UserRole, UserStatus } = await import('../schemas/user.schema')
    console.log('✅ User schema imported')
    
    const { OutletStatus } = await import('../schemas/outlet.schema')
    console.log('✅ Outlet schema imported')
    
    const { ProductCategory, ProductStatus, UnitOfMeasure } = await import('../schemas/product.schema')
    console.log('✅ Product schema imported')
    
    const { PaymentMethod, SaleStatus } = await import('../schemas/sale.schema')
    console.log('✅ Sale schema imported')
    
    console.log('🏗️ Creating application context...')
    const app = await NestFactory.createApplicationContext(AppModule)
    console.log('✅ Application context created')
    
    console.log('🧹 Testing password hashing...')
    const hashedPassword = await bcrypt.hash('admin@2025', 10)
    console.log('✅ Password hashed successfully')
    
    await app.close()
    console.log('✅ All tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

testImports()