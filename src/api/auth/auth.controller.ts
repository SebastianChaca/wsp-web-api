import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto copy';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/api/user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  ForgoPasswordSwaggerDecorator,
  LoginSwaggerDecorator,
  RefreshSwaggerDecorator,
  ResetPasswordSwaggerDecorator,
} from './swagger';
import { TokenDto } from 'src/common/dto/token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @LoginSwaggerDecorator()
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('refresh')
  @Auth()
  @RefreshSwaggerDecorator()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @ForgoPasswordSwaggerDecorator()
  @Post('forgotpassword')
  forgotPassword(@Body() email: { email: string }) {
    return this.authService.forgotPassword(email);
  }

  @ResetPasswordSwaggerDecorator()
  @Post('resetpassword')
  resetpassword(
    @Query() tokenDto: TokenDto,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(tokenDto, resetPasswordDto);
  }
}
