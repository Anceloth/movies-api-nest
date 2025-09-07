import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateMovieDto } from '../../application/dtos/create-movie.dto';
import { UpdateMovieDto } from '../../application/dtos/update-movie.dto';
import { MovieQueryDto } from '../../application/dtos/movie-query.dto';
import { MovieResponseDto } from '../../application/dtos/movie-response.dto';
import {
  CreateMovieUseCase,
  GetMovieUseCase,
  GetMoviesUseCase,
  UpdateMovieUseCase,
  DeleteMovieUseCase,
} from '../../application/use-cases/movie';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly getMovieUseCase: GetMovieUseCase,
    private readonly getMoviesUseCase: GetMoviesUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    type: MovieResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'A movie with this title already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    const movie = await this.createMovieUseCase.execute(createMovieDto);
    return this.mapToResponseDto(movie);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Page size', example: 10 })
  @ApiQuery({ name: 'activeOnly', required: false, description: 'Only active movies', example: true })
  @ApiResponse({
    status: 200,
    description: 'Movies list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        movies: {
          type: 'array',
          items: { $ref: '#/components/schemas/MovieResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAll(@Query() query: MovieQueryDto) {
    const result = await this.getMoviesUseCase.execute(query);
    return {
      movies: result.movies.map(movie => this.mapToResponseDto(movie)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie found successfully',
    type: MovieResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
  })
  async findOne(@Param('id') id: string): Promise<MovieResponseDto> {
    const movie = await this.getMovieUseCase.execute(id);
    return this.mapToResponseDto(movie);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    type: MovieResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
  })
  @ApiResponse({
    status: 409,
    description: 'A movie with this title already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MovieResponseDto> {
    const movie = await this.updateMovieUseCase.execute(id, updateMovieDto);
    return this.mapToResponseDto(movie);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiResponse({
    status: 204,
    description: 'Movie deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteMovieUseCase.execute(id);
  }

  private mapToResponseDto(movie: any): MovieResponseDto {
    return {
      id: movie.id,
      title: movie.title,
      genre: movie.genre,
      director: movie.director,
      releaseDate: movie.releaseDate instanceof Date 
        ? movie.releaseDate.toISOString().split('T')[0]
        : movie.releaseDate,
      isActive: movie.isActive,
      createdAt: movie.createdAt instanceof Date 
        ? movie.createdAt.toISOString()
        : movie.createdAt,
      updatedAt: movie.updatedAt instanceof Date 
        ? movie.updatedAt.toISOString()
        : movie.updatedAt,
    };
  }
}
