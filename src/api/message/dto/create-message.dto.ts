import { ApiProperty } from '@nestjs/swagger';

import {
  IsBoolean,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { ContainsValidEmoji } from '../customValidators/validUnicodeEmojis';

class IconReactionDto {
  @ApiProperty()
  @IsString()
  icon: string;
}

export class CreateMessageDto {
  @ApiProperty({
    description: 'from whom is the message',
    example: '6542e38d81d02967f65f7402',
  })
  @IsString()
  from: string;

  @ApiProperty({
    description: 'to whom is the message',
    example: '6542e38d81d02967f65f7402',
  })
  @IsString()
  to: string;

  @ApiProperty({
    description: 'chat message',
    example: 'hey !',
  })
  @IsString()
  @ValidateIf((o) => !o.image)
  message: string;

  @ApiProperty({
    description: 'chat message status',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  seen?: boolean;

  @ApiProperty({
    description: 'response to message',
    example: 'hi !',
  })
  @IsString()
  @IsOptional()
  responseTo?: string;

  @ApiProperty({
    type: [IconReactionDto],
    description: 'Array of icon reactions',
  })
  @IsString()
  @IsOptional()
  @Validate(ContainsValidEmoji)
  iconReactions?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.message)
  image: string;
}
