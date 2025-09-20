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
    app.enableCors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    });
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
}
bootstrap();
//# sourceMappingURL=main.js.map