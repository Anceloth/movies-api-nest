import { IsString, IsNotEmpty, IsDateString, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateShowtimeDto {
  @ApiProperty({
    description: 'Movie ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  movieId: string;

  @ApiProperty({
    description: 'Room ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @ApiProperty({
    description: 'Showtime start time',
    example: '2024-01-15T19:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  // @Transform(({ value }) => new Date(value))
  startTime: Date;

  @ApiProperty({
    description: 'Movie duration in minutes',
    example: 120,
    minimum: 30,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(30)
  durationMinutes: number;
}
