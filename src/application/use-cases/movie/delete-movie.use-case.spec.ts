import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteMovieUseCase } from './delete-movie.use-case';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';

describe('DeleteMovieUseCase', () => {
  let useCase: DeleteMovieUseCase;
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
        DeleteMovieUseCase,
        {
          provide: 'MovieRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteMovieUseCase>(DeleteMovieUseCase);
    mockMovieRepository = module.get('MovieRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const movieId = '123e4567-e89b-12d3-a456-426614174000';

    it('should delete movie successfully when movie exists', async () => {
      // Arrange
      const existingMovie = Movie.create(
        'The Matrix',
        'Action',
        'The Wachowskis',
        new Date('1999-03-31'),
      );
      mockMovieRepository.findById.mockResolvedValue(existingMovie);
      mockMovieRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(movieId);

      // Assert
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(mockMovieRepository.delete).toHaveBeenCalledWith(movieId);
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      // Arrange
      mockMovieRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(movieId)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(movieId)).rejects.toThrow('Movie not found');
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(mockMovieRepository.delete).not.toHaveBeenCalled();
    });

    it('should call delete with correct movie ID', async () => {
      // Arrange
      const existingMovie = Movie.create(
        'Inception',
        'Sci-Fi',
        'Christopher Nolan',
        new Date('2010-07-16'),
      );
      mockMovieRepository.findById.mockResolvedValue(existingMovie);
      mockMovieRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(movieId);

      // Assert
      expect(mockMovieRepository.delete).toHaveBeenCalledWith(movieId);
    });

    it('should not call delete when movie is not found', async () => {
      // Arrange
      mockMovieRepository.findById.mockResolvedValue(null);

      // Act & Assert
      try {
        await useCase.execute(movieId);
      } catch (error) {
        // Expected to throw
      }

      // Assert
      expect(mockMovieRepository.delete).not.toHaveBeenCalled();
    });
  });
});
