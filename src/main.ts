import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerCustomOptions } from '@nestjs/swagger/dist/interfaces/swagger-custom-options.interface';
import { AuditInterceptor } from './common/interceptors/audit/audit.interceptor'; 
import { AuditService } from './audit/audit.service';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for production
  app.enableCors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  });

  // Set up global interceptors for auditing
  // Ensure AuditService is available
  const auditService = app.get(AuditService);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new AuditInterceptor(auditService, reflector));
  
  // Set up Swagger documentation
  const config = new DocumentBuilder()
  .setTitle('Rentee API')
  .setDescription('The Rentee API for a peer-to-peer rental marketplace')
  .setVersion('1.0')
  .addTag('Rentee')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'JWT',
  )
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // Set up Swagger UI at a custom path
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true, // Keep authentication token
    },
    customSiteTitle: 'Rentee API Docs', // Set a custom title
  };
  SwaggerModule.setup('docs', app, documentFactory, customOptions);
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Use Railway's PORT environment variable
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
