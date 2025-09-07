import { DataSource } from 'typeorm';
import { UserModel } from '../../models/user.model';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class UserSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(UserModel);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('👥 Users already exist, skipping seeder...');
      return;
    }

    console.log('🌱 Seeding users...');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create sample users
    const users = [
      {
        id: uuidv4(),
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: hashedPassword,
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      },
      {
        id: uuidv4(),
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: hashedPassword,
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      },
      {
        id: uuidv4(),
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
    ];

    // Insert users
    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`✅ Created user: ${userData.firstName} ${userData.lastName} (${userData.email})`);
    }

    console.log('🎉 User seeding completed!');
  }
}
