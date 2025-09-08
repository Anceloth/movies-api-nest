import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RoomQueryDto {
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
    description: 'Only active rooms',
    example: true,
  })
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  activeOnly?: boolean = true;
}
