import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetMovieUseCase } from './get-movie.use-case';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';

describe('GetMovieUseCase', () => {
  let useCase: GetMovieUseCase;
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
        GetMovieUseCase,
        {
          provide: 'MovieRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetMovieUseCase>(GetMovieUseCase);
    mockMovieRepository = module.get('MovieRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const movieId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return movie when found', async () => {
      // Arrange
      const expectedMovie = Movie.create(
        'The Matrix',
        'Action',
        'The Wachowskis',
        new Date('1999-03-31'),
      );
      mockMovieRepository.findById.mockResolvedValue(expectedMovie);

      // Act
      const result = await useCase.execute(movieId);

      // Assert
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(result).toEqual(expectedMovie);
    });

    it('should throw NotFoundException when movie is not found', async () => {
      // Arrange
      mockMovieRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(movieId)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(movieId)).rejects.toThrow('Movie not found');
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(movieId);
    });

    it('should return movie with correct properties', async () => {
      // Arrange
      const expectedMovie = Movie.create(
        'Inception',
        'Sci-Fi',
        'Christopher Nolan',
        new Date('2010-07-16'),
      );
      mockMovieRepository.findById.mockResolvedValue(expectedMovie);

      // Act
      const result = await useCase.execute(movieId);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title', 'Inception');
      expect(result).toHaveProperty('genre', 'Sci-Fi');
      expect(result).toHaveProperty('director', 'Christopher Nolan');
      expect(result).toHaveProperty('releaseDate');
      expect(result).toHaveProperty('isActive', true);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });
});
