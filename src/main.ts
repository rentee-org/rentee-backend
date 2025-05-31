import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for production
  // app.enableCors();
  app.enableCors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  });

  
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
  SwaggerModule.setup('docs', app, documentFactory);
  
  
  // Use Railway's PORT environment variable
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
