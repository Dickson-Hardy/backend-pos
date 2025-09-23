import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // SIMPLIFIED CORS CONFIGURATION - GUARANTEED TO WORK
  console.log('🔧 Environment Check:')
  console.log('  NODE_ENV:', process.env.NODE_ENV)
  console.log('  FRONTEND_URL:', process.env.FRONTEND_URL)
  console.log('  PORT:', process.env.PORT)
  
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // Production: Specific origins only
    console.log('� Configuring PRODUCTION CORS')
    app.enableCors({
      origin: [
        'https://frontend-poz.vercel.app',
        'https://frontend-poz.vercel.app/',
        'http://localhost:3000'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin',
        'x-auth-token'
      ],
      optionsSuccessStatus: 200
    })
    console.log('✅ Production CORS configured for Vercel frontend')
  } else {
    // Development: More permissive
    console.log('🛠️ Configuring DEVELOPMENT CORS')
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true
    })
    console.log('✅ Development CORS configured for localhost')
  }

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Pharmacy POS API")
    .setDescription("Pharmacy Point of Sale Management System API")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  // Set global prefix for all routes
  app.setGlobalPrefix("api")

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 Pharmacy POS Backend running on port ${port}`)
  console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`)
}

bootstrap()
