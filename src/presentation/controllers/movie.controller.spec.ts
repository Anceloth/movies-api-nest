import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { CreateMovieUseCase } from '../../application/use-cases/movie/create-movie.use-case';
import { GetMovieUseCase } from '../../application/use-cases/movie/get-movie.use-case';
import { GetMoviesUseCase } from '../../application/use-cases/movie/get-movies.use-case';
import { UpdateMovieUseCase } from '../../application/use-cases/movie/update-movie.use-case';
import { DeleteMovieUseCase } from '../../application/use-cases/movie/delete-movie.use-case';
import { Movie } from '../../domain/entities/movie.entity';
import { CreateMovieDto } from '../../application/dtos/create-movie.dto';
import { UpdateMovieDto } from '../../application/dtos/update-movie.dto';
import { MovieQueryDto } from '../../application/dtos/movie-query.dto';

describe('MovieController', () => {
  let controller: MovieController;
  let createMovieUseCase: jest.Mocked<CreateMovieUseCase>;
  let getMovieUseCase: jest.Mocked<GetMovieUseCase>;
  let getMoviesUseCase: jest.Mocked<GetMoviesUseCase>;
  let updateMovieUseCase: jest.Mocked<UpdateMovieUseCase>;
  let deleteMovieUseCase: jest.Mocked<DeleteMovieUseCase>;

  beforeEach(async () => {
    const mockCreateMovieUseCase = {
      execute: jest.fn(),
    };
    const mockGetMovieUseCase = {
      execute: jest.fn(),
    };
    const mockGetMoviesUseCase = {
      execute: jest.fn(),
    };
    const mockUpdateMovieUseCase = {
      execute: jest.fn(),
    };
    const mockDeleteMovieUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: CreateMovieUseCase,
          useValue: mockCreateMovieUseCase,
        },
        {
          provide: GetMovieUseCase,
          useValue: mockGetMovieUseCase,
        },
        {
          provide: GetMoviesUseCase,
          useValue: mockGetMoviesUseCase,
        },
        {
          provide: UpdateMovieUseCase,
          useValue: mockUpdateMovieUseCase,
        },
        {
          provide: DeleteMovieUseCase,
          useValue: mockDeleteMovieUseCase,
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    createMovieUseCase = module.get(CreateMovieUseCase);
    getMovieUseCase = module.get(GetMovieUseCase);
    getMoviesUseCase = module.get(GetMoviesUseCase);
    updateMovieUseCase = module.get(UpdateMovieUseCase);
    deleteMovieUseCase = module.get(DeleteMovieUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie successfully', async () => {
      // Arrange
      const createMovieDto: CreateMovieDto = {
        title: 'The Matrix',
        genre: 'Action',
        director: 'The Wachowskis',
        releaseDate: '1999-03-31',
      };
      const expectedMovie = Movie.create(
        'The Matrix',
        'Action',
        'The Wachowskis',
        new Date('1999-03-31'),
      );
      createMovieUseCase.execute.mockResolvedValue(expectedMovie);

      // Act
      const result = await controller.create(createMovieDto);

      // Assert
      expect(createMovieUseCase.execute).toHaveBeenCalledWith(createMovieDto);
      expect(result).toEqual({
        id: expectedMovie.id,
        title: expectedMovie.title,
        genre: expectedMovie.genre,
        director: expectedMovie.director,
        releaseDate: expectedMovie.releaseDate.toISOString().split('T')[0],
        isActive: expectedMovie.isActive,
        createdAt: expectedMovie.createdAt.toISOString(),
        updatedAt: expectedMovie.updatedAt.toISOString(),
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated movies list', async () => {
      // Arrange
      const query: MovieQueryDto = { page: 1, limit: 10, activeOnly: true };
      const movies = [
        Movie.create('The Matrix', 'Action', 'The Wachowskis', new Date('1999-03-31')),
        Movie.create('Inception', 'Sci-Fi', 'Christopher Nolan', new Date('2010-07-16')),
      ];
      const mockResult = {
        movies,
        total: 2,
        page: 1,
        limit: 10,
      };
      getMoviesUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const result = await controller.findAll(query);

      // Assert
      expect(getMoviesUseCase.execute).toHaveBeenCalledWith(query);
      expect(result).toEqual({
        movies: [
          {
            id: movies[0].id,
            title: movies[0].title,
            genre: movies[0].genre,
            director: movies[0].director,
            releaseDate: movies[0].releaseDate.toISOString().split('T')[0],
            isActive: movies[0].isActive,
            createdAt: movies[0].createdAt.toISOString(),
            updatedAt: movies[0].updatedAt.toISOString(),
          },
          {
            id: movies[1].id,
            title: movies[1].title,
            genre: movies[1].genre,
            director: movies[1].director,
            releaseDate: movies[1].releaseDate.toISOString().split('T')[0],
            isActive: movies[1].isActive,
            createdAt: movies[1].createdAt.toISOString(),
            updatedAt: movies[1].updatedAt.toISOString(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      // Arrange
      const movieId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedMovie = Movie.create(
        'The Matrix',
        'Action',
        'The Wachowskis',
        new Date('1999-03-31'),
      );
      getMovieUseCase.execute.mockResolvedValue(expectedMovie);

      // Act
      const result = await controller.findOne(movieId);

      // Assert
      expect(getMovieUseCase.execute).toHaveBeenCalledWith(movieId);
      expect(result).toEqual({
        id: expectedMovie.id,
        title: expectedMovie.title,
        genre: expectedMovie.genre,
        director: expectedMovie.director,
        releaseDate: expectedMovie.releaseDate.toISOString().split('T')[0],
        isActive: expectedMovie.isActive,
        createdAt: expectedMovie.createdAt.toISOString(),
        updatedAt: expectedMovie.updatedAt.toISOString(),
      });
    });
  });

  describe('update', () => {
    it('should update a movie successfully', async () => {
      // Arrange
      const movieId = '123e4567-e89b-12d3-a456-426614174000';
      const updateMovieDto: UpdateMovieDto = {
        title: 'The Matrix Reloaded',
        genre: 'Action',
        director: 'The Wachowskis',
        releaseDate: '2003-05-15',
      };
      const updatedMovie = Movie.create(
        'The Matrix Reloaded',
        'Action',
        'The Wachowskis',
        new Date('2003-05-15'),
      );
      updateMovieUseCase.execute.mockResolvedValue(updatedMovie);

      // Act
      const result = await controller.update(movieId, updateMovieDto);

      // Assert
      expect(updateMovieUseCase.execute).toHaveBeenCalledWith(movieId, updateMovieDto);
      expect(result).toEqual({
        id: updatedMovie.id,
        title: updatedMovie.title,
        genre: updatedMovie.genre,
        director: updatedMovie.director,
        releaseDate: updatedMovie.releaseDate.toISOString().split('T')[0],
        isActive: updatedMovie.isActive,
        createdAt: updatedMovie.createdAt.toISOString(),
        updatedAt: updatedMovie.updatedAt.toISOString(),
      });
    });
  });

  describe('remove', () => {
    it('should delete a movie successfully', async () => {
      // Arrange
      const movieId = '123e4567-e89b-12d3-a456-426614174000';
      deleteMovieUseCase.execute.mockResolvedValue(undefined);

      // Act
      await controller.remove(movieId);

      // Assert
      expect(deleteMovieUseCase.execute).toHaveBeenCalledWith(movieId);
    });
  });

  describe('mapToResponseDto', () => {
    it('should map movie entity to response DTO correctly', () => {
      // Arrange
      const movie = Movie.create(
        'The Matrix',
        'Action',
        'The Wachowskis',
        new Date('1999-03-31'),
      );
      const controller = new MovieController(
        createMovieUseCase,
        getMovieUseCase,
        getMoviesUseCase,
        updateMovieUseCase,
        deleteMovieUseCase,
      );

      // Act
      const result = (controller as any).mapToResponseDto(movie);

      // Assert
      expect(result).toEqual({
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        director: movie.director,
        releaseDate: movie.releaseDate.toISOString().split('T')[0],
        isActive: movie.isActive,
        createdAt: movie.createdAt.toISOString(),
        updatedAt: movie.updatedAt.toISOString(),
      });
    });

    it('should handle string dates in mapToResponseDto', () => {
      // Arrange
      const movie = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'The Matrix',
        genre: 'Action',
        director: 'The Wachowskis',
        releaseDate: '1999-03-31',
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };
      const controller = new MovieController(
        createMovieUseCase,
        getMovieUseCase,
        getMoviesUseCase,
        updateMovieUseCase,
        deleteMovieUseCase,
      );

      // Act
      const result = (controller as any).mapToResponseDto(movie);

      // Assert
      expect(result).toEqual({
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        director: movie.director,
        releaseDate: movie.releaseDate,
        isActive: movie.isActive,
        createdAt: movie.createdAt,
        updatedAt: movie.updatedAt,
      });
    });
  });
});
