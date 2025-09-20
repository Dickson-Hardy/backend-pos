console.log('🚀 JavaScript seed starting...')

require('dotenv').config()

async function seed() {
  console.log('🔗 Database:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@'))
  
  try {
    const { NestFactory } = require('@nestjs/core')
    const { AppModule } = require('../app.module')
    
    console.log('🏗️ Creating application context...')
    const app = await NestFactory.createApplicationContext(AppModule)
    console.log('✅ Application created successfully!')
    
    await app.close()
    console.log('✅ Test completed')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

seed()