import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    default: 'Sebastian',
    description: 'user name',
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  image?: string;
}
