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
import { CreateRoomDto } from '../../application/dtos/create-room.dto';
import { UpdateRoomDto } from '../../application/dtos/update-room.dto';
import { RoomQueryDto } from '../../application/dtos/room-query.dto';
import { RoomResponseDto } from '../../application/dtos/room-response.dto';
import {
  CreateRoomUseCase,
  GetRoomUseCase,
  GetRoomsUseCase,
  UpdateRoomUseCase,
  DeleteRoomUseCase,
} from '../../application/use-cases/room';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
    private readonly getRoomUseCase: GetRoomUseCase,
    private readonly getRoomsUseCase: GetRoomsUseCase,
    private readonly updateRoomUseCase: UpdateRoomUseCase,
    private readonly deleteRoomUseCase: DeleteRoomUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'A room with this name already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() createRoomDto: CreateRoomDto): Promise<RoomResponseDto> {
    const room = await this.createRoomUseCase.execute(createRoomDto);
    return this.mapToResponseDto(room);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Page size', example: 10 })
  @ApiQuery({ name: 'activeOnly', required: false, description: 'Only active rooms', example: true })
  @ApiResponse({
    status: 200,
    description: 'Rooms list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        rooms: {
          type: 'array',
          items: { $ref: '#/components/schemas/RoomResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAll(@Query() query: RoomQueryDto) {
    const result = await this.getRoomsUseCase.execute(query);
    return {
      rooms: result.rooms.map(room => this.mapToResponseDto(room)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({
    status: 200,
    description: 'Room found successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  async findOne(@Param('id') id: string): Promise<RoomResponseDto> {
    const room = await this.getRoomUseCase.execute(id);
    return this.mapToResponseDto(room);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  @ApiResponse({
    status: 409,
    description: 'A room with this name already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<RoomResponseDto> {
    const room = await this.updateRoomUseCase.execute(id, updateRoomDto);
    return this.mapToResponseDto(room);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({
    status: 204,
    description: 'Room deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteRoomUseCase.execute(id);
  }

  private mapToResponseDto(room: any): RoomResponseDto {
    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      isActive: room.isActive,
      createdAt: room.createdAt instanceof Date
        ? room.createdAt.toISOString()
        : room.createdAt,
      updatedAt: room.updatedAt instanceof Date
        ? room.updatedAt.toISOString()
        : room.updatedAt,
    };
  }
}
