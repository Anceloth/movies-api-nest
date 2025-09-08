import { DataSource } from 'typeorm';
import { RoomModel } from '../../models/room.model';
import { v4 as uuidv4 } from 'uuid';

export class RoomSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const roomRepository = dataSource.getRepository(RoomModel);

    // Check if rooms already exist
    const existingRooms = await roomRepository.count();
    if (existingRooms > 0) {
      console.log('🎭 Rooms already exist, skipping seeder...');
      return;
    }

    console.log('🌱 Seeding rooms...');

    // Create sample rooms
    const rooms = [
      {
        id: uuidv4(),
        name: 'Sala 1',
        capacity: 50,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Sala 2',
        capacity: 75,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Sala 3',
        capacity: 100,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Sala VIP',
        capacity: 25,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Sala IMAX',
        capacity: 150,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Sala 3D',
        capacity: 80,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Sala Premium',
        capacity: 30,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Sala Grande',
        capacity: 200,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Sala Pequeña',
        capacity: 40,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Sala Antigua (Inactiva)',
        capacity: 60,
        isActive: false,
      },
    ];

    // Insert rooms
    for (const roomData of rooms) {
      const room = roomRepository.create(roomData);
      await roomRepository.save(room);
      console.log(`✅ Created room: ${roomData.name} (${roomData.capacity} seats)`);
    }

    console.log('🎉 Room seeding completed!');
  }
}
