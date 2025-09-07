import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const configService = new ConfigService();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
const missingVars = requiredEnvVars.filter(varName => !configService.get(varName));

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
  logging: configService.get('DB_LOGGING') === 'true',
  entities: ['src/infrastructure/models/*.model.ts'],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  subscribers: ['src/**/*.subscriber.ts'],
});
