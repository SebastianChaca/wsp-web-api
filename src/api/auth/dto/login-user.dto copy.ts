import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    default: 'sebastian@g.com',
    description: 'user email',
    nullable: false,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'Hola1234',
    description: 'password with uppercase and number',
    nullable: false,
  })
  @IsNotEmpty()
  password: string;
}
