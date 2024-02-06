import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
export class CreateFriendDto {
  @ApiProperty({
    example: 'seba@g.com',
    description: 'email of user to add to friend list',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 2,
    description: 'number of notificacions of messages unread',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  notifications?: number;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isRequesting?: boolean;

  @ApiProperty({
    example: 1,
    description: 'friendship status: 0: requested, 1:accepted: 2: blocked',
  })
  @IsNumber()
  @IsInt()
  @IsIn([0, 1, 2])
  @IsOptional()
  status?: number;

  @ApiProperty({
    description: 'id from current user',
  })
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'id from friend',
  })
  @IsOptional()
  friendId?: string;
}
