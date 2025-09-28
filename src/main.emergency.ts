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
    // Production: Specific origins only
    console.log('🚀 Configuring PRODUCTION CORS (Emergency)')
    const allowedOrigins = [
      'https://frontend-poz.vercel.app',
      'https://frontend-poz.vercel.app/',
      'http://localhost:3000',
      'http://localhost:3001'
    ]
    
    console.log('🔗 Allowed Origins (Emergency):', allowedOrigins)
    
    app.enableCors({
      origin: (origin, callback) => {
        console.log('🌐 Request from origin (Emergency):', origin)
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true)
        
        if (allowedOrigins.includes(origin)) {
          console.log('✅ Origin allowed (Emergency):', origin)
          return callback(null, true)
        } else {
          console.log('❌ Origin blocked (Emergency):', origin)
          return callback(new Error('Not allowed by CORS'), false)
        }
      },
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
      optionsSuccessStatus: 200,
      preflightContinue: false
    })
    console.log('✅ Production CORS configured for Vercel frontend (Emergency)')
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