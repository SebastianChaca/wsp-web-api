import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class UpdateMessageSeen {
  @ApiProperty({
    description: 'update if the message has benn seen',
    example: true,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  messagesId: string[];
}
