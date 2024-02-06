import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    minimum: 0,
    default: 0,
    description: 'limit for get list',
    example: 20,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    minimum: 0,
    default: 0,
    description: 'limit for get list',
    example: 10,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  page?: number;
}
