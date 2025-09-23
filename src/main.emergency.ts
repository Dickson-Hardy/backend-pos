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

  // EMERGENCY CORS FIX - GUARANTEED TO WORK
  console.log('🚨 Using emergency CORS configuration')
  console.log('🔧 Environment FRONTEND_URL:', process.env.FRONTEND_URL)
  console.log('🔧 Node ENV:', process.env.NODE_ENV)
  
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // Production CORS - specific origins only
    app.enableCors({
      origin: [
        'https://frontend-pos-gold.vercel.app',
        'https://frontend-pos-gold.vercel.app/',
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
        'Cache-Control',
        'x-auth-token'
      ],
      optionsSuccessStatus: 200
    })
    console.log('✅ Production CORS enabled for specific origins')
  } else {
    // Development CORS - more permissive
    app.enableCors({
      origin: true,
      credentials: true
    })
    console.log('✅ Development CORS enabled (permissive)')
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
  console.log(`🌐 CORS configured for: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`)
}

bootstrap()