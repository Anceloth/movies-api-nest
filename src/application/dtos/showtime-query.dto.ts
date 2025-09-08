import { IsOptional, IsNumber, Min, IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ShowtimeQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Page size',
    example: 10,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Only active showtimes',
    example: true,
  })
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  activeOnly?: boolean = true;

  @ApiPropertyOptional({
    description: 'Filter by movie ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  movieId?: string;

  @ApiPropertyOptional({
    description: 'Filter by room ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  roomId?: string;

  @ApiPropertyOptional({
    description: 'Filter by start date (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @IsString()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date (YYYY-MM-DD)',
    example: '2024-01-16',
  })
  @IsString()
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
