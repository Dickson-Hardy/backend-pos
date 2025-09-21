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

  // Enable CORS with flexible configuration for production
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3000",
    "https://frontend-pos-gold.vercel.app",
    "https://frontend-pos-gold.vercel.app/", // Handle trailing slash
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
  ].filter(Boolean)

  console.log('🌐 Allowed CORS origins:', allowedOrigins)

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        console.log('✅ CORS: Allowing request with no origin')
        return callback(null, true)
      }
      
      // Normalize origin by removing trailing slash
      const normalizedOrigin = origin.replace(/\/$/, '')
      const normalizedAllowed = allowedOrigins.map(url => url.replace(/\/$/, ''))
      
      if (normalizedAllowed.includes(normalizedOrigin)) {
        console.log(`✅ CORS: Allowing origin: ${origin}`)
        return callback(null, true)
      }
      
      console.warn(`❌ CORS: Blocked origin: ${origin}`)
      console.warn(`🔍 Available origins: ${normalizedAllowed.join(', ')}`)
      return callback(new Error('Not allowed by CORS'), false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    maxAge: 86400, // 24 hours
  })

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
