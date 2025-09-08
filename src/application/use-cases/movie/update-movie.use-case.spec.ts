import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateMovieUseCase } from './update-movie.use-case';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';
import { UpdateMovieDto } from '../../dtos/update-movie.dto';

describe('UpdateMovieUseCase', () => {
  let useCase: UpdateMovieUseCase;
  let mockMovieRepository: jest.Mocked<MovieRepositoryInterface>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findActive: jest.fn(),
      findByTitle: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMovieUseCase,
        {
          provide: 'MovieRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateMovieUseCase>(UpdateMovieUseCase);
    mockMovieRepository = module.get('MovieRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const movieId = '123e4567-e89b-12d3-a456-426614174000';
    const existingMovie = Movie.create(
      'The Matrix',
      'Action',
      'The Wachowskis',
      new Date('1999-03-31'),
    );

    it('should update movie successfully when all validations pass', async () => {
      // Arrange
      const updateMovieDto: UpdateMovieDto = {
        title: 'The Matrix Reloaded',
        genre: 'Action',
        director: 'The Wachowskis',
        releaseDate: '2003-05-15',
      };
      const updatedMovie = existingMovie.update(
        'The Matrix Reloaded',
        'Action',
        'The Wachowskis',
        new Date('2003-05-15'),
      );
      
      mockMovieRepository.findById.mockResolvedValue(existingMovie);
      mockMovieRepository.findByTitle.mockResolvedValue(null);
      mockMovieRepository.update.mockResolvedValue(updatedMovie);

      // Act
      const result = await useCase.execute(movieId, updateMovieDto);

      // Assert
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(mockMovieRepository.findByTitle).toHaveBeenCalledWith('The Matrix Reloaded');
      expect(mockMovieRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'The Matrix Reloaded',
          genre: 'Action',
          director: 'The Wachowskis',
          releaseDate: new Date('2003-05-15'),
        }),
      );
      expect(result).toEqual(updatedMovie);
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      // Arrange
      const updateMovieDto: UpdateMovieDto = { title: 'The Matrix Reloaded' };
      mockMovieRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(movieId, updateMovieDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.execute(movieId, updateMovieDto)).rejects.toThrow(
        'Movie not found',
      );
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(mockMovieRepository.findByTitle).not.toHaveBeenCalled();
      expect(mockMovieRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when new title already exists', async () => {
      // Arrange
      const updateMovieDto: UpdateMovieDto = { title: 'Inception' };
      const movieWithSameTitle = Movie.create(
        'Inception',
        'Sci-Fi',
        'Christopher Nolan',
        new Date('2010-07-16'),
      );
      
      mockMovieRepository.findById.mockResolvedValue(existingMovie);
      mockMovieRepository.findByTitle.mockResolvedValue(movieWithSameTitle);

      // Act & Assert
      await expect(useCase.execute(movieId, updateMovieDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(useCase.execute(movieId, updateMovieDto)).rejects.toThrow(
        'A movie with this title already exists',
      );
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(mockMovieRepository.findByTitle).toHaveBeenCalledWith('Inception');
      expect(mockMovieRepository.update).not.toHaveBeenCalled();
    });

    it('should not check title uniqueness when title is not being updated', async () => {
      // Arrange
      const updateMovieDto: UpdateMovieDto = { genre: 'Sci-Fi' };
      const updatedMovie = existingMovie.update(
        undefined,
        'Sci-Fi',
        undefined,
        undefined,
      );
      
      mockMovieRepository.findById.mockResolvedValue(existingMovie);
      mockMovieRepository.update.mockResolvedValue(updatedMovie);

      // Act
      const result = await useCase.execute(movieId, updateMovieDto);

      // Assert
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(mockMovieRepository.findByTitle).not.toHaveBeenCalled();
      expect(mockMovieRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'The Matrix',
          genre: 'Sci-Fi',
          director: 'The Wachowskis',
        }),
      );
      expect(result).toEqual(updatedMovie);
    });

    it('should not check title uniqueness when new title is same as current', async () => {
      // Arrange
      const updateMovieDto: UpdateMovieDto = { title: 'The Matrix', genre: 'Sci-Fi' };
      const updatedMovie = existingMovie.update(
        'The Matrix',
        'Sci-Fi',
        undefined,
        undefined,
      );
      
      mockMovieRepository.findById.mockResolvedValue(existingMovie);
      mockMovieRepository.update.mockResolvedValue(updatedMovie);

      // Act
      const result = await useCase.execute(movieId, updateMovieDto);

      // Assert
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(mockMovieRepository.findByTitle).not.toHaveBeenCalled();
      expect(mockMovieRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'The Matrix',
          genre: 'Sci-Fi',
          director: 'The Wachowskis',
        }),
      );
      expect(result).toEqual(updatedMovie);
    });

    it('should update only genre when only genre is provided', async () => {
      // Arrange
      const updateMovieDto: UpdateMovieDto = { genre: 'Sci-Fi' };
      const updatedMovie = existingMovie.update(
        undefined,
        'Sci-Fi',
        undefined,
        undefined,
      );
      
      mockMovieRepository.findById.mockResolvedValue(existingMovie);
      mockMovieRepository.update.mockResolvedValue(updatedMovie);

      // Act
      const result = await useCase.execute(movieId, updateMovieDto);

      // Assert
      expect(mockMovieRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'The Matrix',
          genre: 'Sci-Fi',
          director: 'The Wachowskis',
        }),
      );
      expect(result).toEqual(updatedMovie);
    });
  });
});
