import { DataSource } from 'typeorm';
import { ShowtimeModel } from '../../models/showtime.model';
import { MovieModel } from '../../models/movie.model';
import { RoomModel } from '../../models/room.model';
import { v4 as uuidv4 } from 'uuid';

export class ShowtimeSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const showtimeRepository = dataSource.getRepository(ShowtimeModel);
    const movieRepository = dataSource.getRepository(MovieModel);
    const roomRepository = dataSource.getRepository(RoomModel);

    const existingShowtimes = await showtimeRepository.count();
    if (existingShowtimes > 0) {
      console.log('🎬 Showtimes already exist, skipping seeder...');
      return;
    }

    console.log('🌱 Seeding showtimes...');

    // Get some movies and rooms for creating showtimes
    const movies = await movieRepository.find({ where: { isActive: true }, take: 5 });
    const rooms = await roomRepository.find({ where: { isActive: true }, take: 3 });

    if (movies.length === 0 || rooms.length === 0) {
      console.log('⚠️  No active movies or rooms found. Please run movie and room seeders first.');
      return;
    }

    const showtimes = [];

    // Create showtimes for the next 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);

      // Create 2-3 showtimes per day
      const showtimesPerDay = Math.floor(Math.random() * 2) + 2; // 2-3 showtimes

      for (let i = 0; i < showtimesPerDay; i++) {
        const movie = movies[Math.floor(Math.random() * movies.length)];
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        
        // Random start time between 14:00 and 22:00
        const startHour = 14 + Math.floor(Math.random() * 8);
        const startMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        
        const startTime = new Date(currentDate);
        startTime.setHours(startHour, startMinute, 0, 0);
        
        // Duration between 90 and 150 minutes
        const durationMinutes = 90 + Math.floor(Math.random() * 4) * 15; // 90, 105, 120, 135, 150
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        const showtime = {
          id: uuidv4(),
          movieId: movie.id,
          roomId: room.id,
          startTime,
          endTime,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        showtimes.push(showtime);
      }
    }

    // Add some inactive showtimes
    const inactiveShowtime = {
      id: uuidv4(),
      movieId: movies[0].id,
      roomId: rooms[0].id,
      startTime: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      endTime: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000 + 120 * 60000),
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    showtimes.push(inactiveShowtime);

    // Save all showtimes
    for (const showtimeData of showtimes) {
      const showtime = showtimeRepository.create(showtimeData);
      await showtimeRepository.save(showtime);
      
      const movie = movies.find(m => m.id === showtimeData.movieId);
      const room = rooms.find(r => r.id === showtimeData.roomId);
      
      console.log(`✅ Created showtime: ${movie?.title} in ${room?.name} at ${showtimeData.startTime.toLocaleString()}`);
    }

    console.log('🎉 Showtime seeding completed!');
  }
}
