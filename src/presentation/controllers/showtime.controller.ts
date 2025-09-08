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
import { CreateShowtimeDto } from '../../application/dtos/create-showtime.dto';
import { UpdateShowtimeDto } from '../../application/dtos/update-showtime.dto';
import { ShowtimeQueryDto } from '../../application/dtos/showtime-query.dto';
import { ShowtimeResponseDto } from '../../application/dtos/showtime-response.dto';
import {
  CreateShowtimeUseCase,
  GetShowtimeUseCase,
  GetShowtimesUseCase,
  UpdateShowtimeUseCase,
  DeleteShowtimeUseCase,
} from '../../application/use-cases/showtime';

@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimeController {
  constructor(
    private readonly createShowtimeUseCase: CreateShowtimeUseCase,
    private readonly getShowtimeUseCase: GetShowtimeUseCase,
    private readonly getShowtimesUseCase: GetShowtimesUseCase,
    private readonly updateShowtimeUseCase: UpdateShowtimeUseCase,
    private readonly deleteShowtimeUseCase: DeleteShowtimeUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new showtime' })
  @ApiResponse({
    status: 201,
    description: 'Showtime created successfully',
    type: ShowtimeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Movie or Room not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Time conflict with existing showtime',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() createShowtimeDto: CreateShowtimeDto): Promise<ShowtimeResponseDto> {
    const showtime = await this.createShowtimeUseCase.execute(createShowtimeDto);
    return this.mapToResponseDto(showtime);
  }

  @Get()
  @ApiOperation({ summary: 'Get all showtimes' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Page size', example: 10 })
  @ApiQuery({ name: 'activeOnly', required: false, description: 'Only active showtimes', example: true })
  @ApiQuery({ name: 'movieId', required: false, description: 'Filter by movie ID' })
  @ApiQuery({ name: 'roomId', required: false, description: 'Filter by room ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Showtimes list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        showtimes: {
          type: 'array',
          items: { $ref: '#/components/schemas/ShowtimeResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAll(@Query() query: ShowtimeQueryDto) {
    const result = await this.getShowtimesUseCase.execute(query);
    return {
      showtimes: result.showtimes.map(showtime => this.mapToResponseDto(showtime)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a showtime by ID' })
  @ApiParam({ name: 'id', description: 'Showtime ID' })
  @ApiResponse({
    status: 200,
    description: 'Showtime found successfully',
    type: ShowtimeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Showtime not found',
  })
  async findOne(@Param('id') id: string): Promise<ShowtimeResponseDto> {
    const showtime = await this.getShowtimeUseCase.execute(id);
    return this.mapToResponseDto(showtime);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a showtime' })
  @ApiParam({ name: 'id', description: 'Showtime ID' })
  @ApiResponse({
    status: 200,
    description: 'Showtime updated successfully',
    type: ShowtimeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Showtime, Movie or Room not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Time conflict with existing showtime',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<ShowtimeResponseDto> {
    const showtime = await this.updateShowtimeUseCase.execute(id, updateShowtimeDto);
    return this.mapToResponseDto(showtime);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a showtime' })
  @ApiParam({ name: 'id', description: 'Showtime ID' })
  @ApiResponse({
    status: 204,
    description: 'Showtime deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Showtime not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteShowtimeUseCase.execute(id);
  }

  private mapToResponseDto(showtime: any): ShowtimeResponseDto {
    return {
      id: showtime.id,
      movieId: showtime.movieId,
      roomId: showtime.roomId,
      startTime: showtime.startTime instanceof Date
        ? showtime.startTime.toISOString()
        : showtime.startTime,
      endTime: showtime.endTime instanceof Date
        ? showtime.endTime.toISOString()
        : showtime.endTime,
      isActive: showtime.isActive,
      createdAt: showtime.createdAt instanceof Date
        ? showtime.createdAt.toISOString()
        : showtime.createdAt,
      updatedAt: showtime.updatedAt instanceof Date
        ? showtime.updatedAt.toISOString()
        : showtime.updatedAt,
    };
  }
}
