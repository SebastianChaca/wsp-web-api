import { ApiProperty } from '@nestjs/swagger';

import { IsEmail } from 'class-validator';

export class EmailDto {
  @ApiProperty({
    description: 'user email',
  })
  @IsEmail()
  email: string;
}
