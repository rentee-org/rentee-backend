import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config = databaseConfig();
        return {
          ...config,
          type: config.type as 'postgres', // Adjust this based on your database type
        };
      },
    }),
  ],
})
export class DatabaseModule {}
