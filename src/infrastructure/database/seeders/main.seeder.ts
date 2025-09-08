import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seeder';
import { MovieSeeder } from './movie.seeder';
import { RoomSeeder } from './room.seeder';
import { ShowtimeSeeder } from './showtime.seeder';

export class MainSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    console.log('🌱 Starting database seeding...');

    try {
      // Run all seeders
      await UserSeeder.run(dataSource);
      await MovieSeeder.run(dataSource);
      await RoomSeeder.run(dataSource);
      await ShowtimeSeeder.run(dataSource);

      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }
}
