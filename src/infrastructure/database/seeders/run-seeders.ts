import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MainSeeder } from './main.seeder';
import { UserModel } from '../../models/user.model';
import { MovieModel } from '../../models/movie.model';
import { RoomModel } from '../../models/room.model';
import { ShowtimeModel } from '../../models/showtime.model';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const configService = new ConfigService();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
const missingVars = requiredEnvVars.filter(varName => !configService.get(varName));

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Create DataSource configuration
const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  synchronize: false, // Don't auto-sync in seeders
  logging: configService.get('DB_LOGGING') === 'true',
  entities: [UserModel, MovieModel, RoomModel, ShowtimeModel],
});

async function runSeeders() {
  console.log('🚀 Initializing database connection...');
  
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Run seeders
    await MainSeeder.run(AppDataSource);

  } catch (error) {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
  } finally {
    // Close the connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the seeders
runSeeders();
