import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginUserDto } from './dto/login-user.dto copy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
