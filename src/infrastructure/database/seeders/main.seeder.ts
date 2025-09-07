import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seeder';

export class MainSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    try {
      // Run all seeders
      await UserSeeder.run(dataSource);
      
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }
}
