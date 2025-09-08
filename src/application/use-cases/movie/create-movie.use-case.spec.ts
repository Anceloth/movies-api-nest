import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateMovieUseCase } from './create-movie.use-case';
import { Movie } from '../../../domain/entities/movie.entity';
import { MovieRepositoryInterface } from '../../../domain/repositories/movie.repository.interface';
import { CreateMovieDto } from '../../dtos/create-movie.dto';

describe('CreateMovieUseCase', () => {
  let useCase: CreateMovieUseCase;
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
        CreateMovieUseCase,
        {
          provide: 'MovieRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
    mockMovieRepository = module.get('MovieRepositoryInterface');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'The Matrix',
      genre: 'Action',
      director: 'The Wachowskis',
      releaseDate: '1999-03-31',
    };

    it('should create a movie successfully when title is unique', async () => {
      // Arrange
      const expectedMovie = Movie.create(
        'The Matrix',
        'Action',
        'The Wachowskis',
        new Date('1999-03-31'),
      );
      mockMovieRepository.findByTitle.mockResolvedValue(null);
      mockMovieRepository.create.mockResolvedValue(expectedMovie);

      // Act
      const result = await useCase.execute(createMovieDto);

      // Assert
      expect(mockMovieRepository.findByTitle).toHaveBeenCalledWith('The Matrix');
      expect(mockMovieRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'The Matrix',
          genre: 'Action',
          director: 'The Wachowskis',
          releaseDate: new Date('1999-03-31'),
          isActive: true,
        }),
      );
      expect(result).toEqual(expectedMovie);
    });

    it('should throw ConflictException when movie with same title already exists', async () => {
      // Arrange
      const existingMovie = Movie.create(
        'The Matrix',
        'Sci-Fi',
        'The Wachowskis',
        new Date('1999-03-31'),
      );
      mockMovieRepository.findByTitle.mockResolvedValue(existingMovie);

      // Act & Assert
      await expect(useCase.execute(createMovieDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(useCase.execute(createMovieDto)).rejects.toThrow(
        'A movie with this title already exists',
      );
      expect(mockMovieRepository.findByTitle).toHaveBeenCalledWith('The Matrix');
      expect(mockMovieRepository.create).not.toHaveBeenCalled();
    });

    it('should create movie with different genre and director', async () => {
      // Arrange
      const createMovieDtoWithDifferentData: CreateMovieDto = {
        title: 'Inception',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
        releaseDate: '2010-07-16',
      };
      const expectedMovie = Movie.create(
        'Inception',
        'Sci-Fi',
        'Christopher Nolan',
        new Date('2010-07-16'),
      );
      mockMovieRepository.findByTitle.mockResolvedValue(null);
      mockMovieRepository.create.mockResolvedValue(expectedMovie);

      // Act
      const result = await useCase.execute(createMovieDtoWithDifferentData);

      // Assert
      expect(mockMovieRepository.findByTitle).toHaveBeenCalledWith('Inception');
      expect(mockMovieRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Inception',
          genre: 'Sci-Fi',
          director: 'Christopher Nolan',
          releaseDate: new Date('2010-07-16'),
          isActive: true,
        }),
      );
      expect(result).toEqual(expectedMovie);
    });
  });
});
