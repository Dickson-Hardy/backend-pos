"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    console.log('🚨 Using emergency CORS configuration');
    console.log('🔧 Environment FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('🔧 Node ENV:', process.env.NODE_ENV);
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
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
        });
        console.log('✅ Production CORS enabled for specific origins');
    }
    else {
        app.enableCors({
            origin: true,
            credentials: true
        });
        console.log('✅ Development CORS enabled (permissive)');
    }
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Pharmacy POS API")
        .setDescription("Pharmacy Point of Sale Management System API")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api/docs", app, document);
    app.setGlobalPrefix("api");
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Pharmacy POS Backend running on port ${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
    console.log(`🌐 CORS configured for: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
}
bootstrap();
//# sourceMappingURL=main.emergency.js.map