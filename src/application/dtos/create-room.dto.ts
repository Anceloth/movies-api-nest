import { IsString, IsNotEmpty, IsNumber, Min, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Room name',
    example: 'Sala 1',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Room capacity in seats',
    example: 50,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  capacity: number;
}
