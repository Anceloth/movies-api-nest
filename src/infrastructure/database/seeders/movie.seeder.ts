import { DataSource } from 'typeorm';
import { MovieModel } from '../../models/movie.model';
import { v4 as uuidv4 } from 'uuid';

export class MovieSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const movieRepository = dataSource.getRepository(MovieModel);

    // Check if movies already exist
    const existingMovies = await movieRepository.count();
    if (existingMovies > 0) {
      console.log('🎬 Movies already exist, skipping seeder...');
      return;
    }

    console.log('🌱 Seeding movies...');

    // Create sample movies
    const movies = [
      {
        id: uuidv4(),
        title: 'The Matrix',
        genre: 'Action',
        director: 'The Wachowskis',
        releaseDate: '1999-03-31',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'Inception',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
        releaseDate: '2010-07-16',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'The Dark Knight',
        genre: 'Action',
        director: 'Christopher Nolan',
        releaseDate: '2008-07-18',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'Pulp Fiction',
        genre: 'Crime',
        director: 'Quentin Tarantino',
        releaseDate: '1994-10-14',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'Forrest Gump',
        genre: 'Drama',
        director: 'Robert Zemeckis',
        releaseDate: '1994-07-06',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'The Godfather',
        genre: 'Crime',
        director: 'Francis Ford Coppola',
        releaseDate: '1972-03-24',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'Avatar',
        genre: 'Sci-Fi',
        director: 'James Cameron',
        releaseDate: '2009-12-18',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'Titanic',
        genre: 'Romance',
        director: 'James Cameron',
        releaseDate: '1997-12-19',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'Interstellar',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
        releaseDate: '2014-11-07',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'The Shawshank Redemption',
        genre: 'Drama',
        director: 'Frank Darabont',
        releaseDate: '1994-09-23',
        isActive: true,
      },
      {
        id: uuidv4(),
        title: 'Old Movie (Inactive)',
        genre: 'Drama',
        director: 'Old Director',
        releaseDate: '1990-01-01',
        isActive: false,
      },
    ];

    // Insert movies
    for (const movieData of movies) {
      const movie = movieRepository.create(movieData);
      await movieRepository.save(movie);
      console.log(`✅ Created movie: ${movieData.title} (${movieData.genre}) - ${movieData.director}`);
    }

    console.log('🎉 Movie seeding completed!');
  }
}
