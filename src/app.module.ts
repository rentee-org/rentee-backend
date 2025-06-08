import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ListingModule } from './listing/listing.module';
import { AuditModule } from './audit/audit.module';

import databaseConfig from './config/database.config';
import cloudinaryConfig from './config/cloudinary.config';
import { IpMiddleware } from './common/middleware/ip/ip.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, cloudinaryConfig],  // Register both database and cloudinary configs
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ListingModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,  // First layer
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,    // Second layer
    },
  ],
})
export class AppModule {
  // Global middleware to resolve IP address
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpMiddleware)  // Apply the IP middleware globally
      .forRoutes('*');      // Apply to all routes
  }
}
