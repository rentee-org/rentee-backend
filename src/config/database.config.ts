import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  // If DATABASE_URL is provided (Railway), use it
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: ['src/migrations/*.ts'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: {
        rejectUnauthorized: false // Required for Railway's SSL connection
      }
    };
  }

  // Fallback to individual connection parameters
  return {
    type: 'postgres',
    host: process.env.SB_DB_HOST,
    port: parseInt(process.env.SB_DB_PORT || '5432', 10),
    username: process.env.SB_DB_USERNAME,
    password: process.env.SB_DB_PASSWORD,
    database: process.env.SB_DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*.ts'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    ssl: process.env.NODE_ENV === 'production',
  };
});
