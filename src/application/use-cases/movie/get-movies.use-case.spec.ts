import { Test, TestingModule } from '@nestjs/testing';
import { GetMoviesUseCase } from './get-movies.use-case';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';
import { MovieQueryDto } from '../../dtos/movie-query.dto';

describe('GetMoviesUseCase', () => {
  let useCase: GetMoviesUseCase;
  let mockMovieRepository: jest.Mocked<MovieRepositoryInterface>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findActive: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMoviesUseCase,
        {
          provide: 'MovieRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetMoviesUseCase>(GetMoviesUseCase);
    mockMovieRepository = module.get('MovieRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return active movies when activeOnly is true', async () => {
      // Arrange
      const query: MovieQueryDto = { activeOnly: true, page: 1, limit: 10 };
      const activeMovies = [
        Movie.create('The Matrix', 'Action', 'The Wachowskis', new Date('1999-03-31')),
        Movie.create('Inception', 'Sci-Fi', 'Christopher Nolan', new Date('2010-07-16')),
      ];
      mockMovieRepository.findActive.mockResolvedValue(activeMovies);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(mockMovieRepository.findActive).toHaveBeenCalled();
      expect(mockMovieRepository.findAll).not.toHaveBeenCalled();
      expect(result).toEqual({
        movies: activeMovies,
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it('should return all movies when activeOnly is false', async () => {
      // Arrange
      const query: MovieQueryDto = { activeOnly: false, page: 1, limit: 10 };
      const allMovies = [
        Movie.create('The Matrix', 'Action', 'The Wachowskis', new Date('1999-03-31')),
        Movie.create('Inception', 'Sci-Fi', 'Christopher Nolan', new Date('2010-07-16')),
        Movie.create('Avatar', 'Sci-Fi', 'James Cameron', new Date('2009-12-18')),
      ];
      mockMovieRepository.findAll.mockResolvedValue(allMovies);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(mockMovieRepository.findAll).toHaveBeenCalled();
      expect(mockMovieRepository.findActive).not.toHaveBeenCalled();
      expect(result).toEqual({
        movies: allMovies,
        total: 3,
        page: 1,
        limit: 10,
      });
    });

    it('should return paginated results', async () => {
      // Arrange
      const query: MovieQueryDto = { activeOnly: true, page: 2, limit: 2 };
      const allMovies = [
        Movie.create('The Matrix', 'Action', 'The Wachowskis', new Date('1999-03-31')),
        Movie.create('Inception', 'Sci-Fi', 'Christopher Nolan', new Date('2010-07-16')),
        Movie.create('Avatar', 'Sci-Fi', 'James Cameron', new Date('2009-12-18')),
        Movie.create('Interstellar', 'Sci-Fi', 'Christopher Nolan', new Date('2014-11-07')),
      ];
      mockMovieRepository.findActive.mockResolvedValue(allMovies);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(result).toEqual({
        movies: [allMovies[2], allMovies[3]], // Page 2 with limit 2
        total: 4,
        page: 2,
        limit: 2,
      });
    });

    it('should return empty array when no movies found', async () => {
      // Arrange
      const query: MovieQueryDto = { activeOnly: true, page: 1, limit: 10 };
      mockMovieRepository.findActive.mockResolvedValue([]);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(result).toEqual({
        movies: [],
        total: 0,
        page: 1,
        limit: 10,
      });
    });

    it('should use default values when query parameters are undefined', async () => {
      // Arrange
      const query: MovieQueryDto = { activeOnly: true }; // Set activeOnly to true explicitly
      const activeMovies = [Movie.create('The Matrix', 'Action', 'The Wachowskis', new Date('1999-03-31'))];
      mockMovieRepository.findActive.mockResolvedValue(activeMovies);

      // Act
      const result = await useCase.execute(query);

      // Assert
      expect(result).toEqual({
        movies: activeMovies,
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });
});
