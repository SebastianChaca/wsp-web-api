import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddSenderDto {
  @ApiProperty({
    description: 'friend id',
  })
  @IsString()
  friendId: string;
}
