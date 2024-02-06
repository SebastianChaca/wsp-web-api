import {
  Injectable,
  UnauthorizedException,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { hashSync, compareSync } from 'bcrypt';
import { User } from 'src/api/user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto copy';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailDto } from 'src/common/dto/email.dto';
import { SendEmailService } from '../send-email/send-email.service';
import { TokenDto } from 'src/common/dto/token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserApiResponse } from '../user/interfaces/userApiResponse.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly sendEmailService: SendEmailService,
  ) {}
  hashPassword(password: string): string {
    return hashSync(password, 10);
  }
  comparePassword(password: string, passwordModel: string): boolean {
    return compareSync(password, passwordModel);
  }
  getJwtToken(payload: JwtPayload): string {
    //generar token
    return this.jwtService.sign(payload);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserApiResponse> {
    const { password, email } = loginUserDto;
    this.logger.log('Login user');
    const user = await this.userModel.findOne({ email });

    if (!user || !this.comparePassword(password, user.password))
      throw new UnauthorizedException('credentials are not valid');

    const userObj = user.toObject();
    delete userObj.password;
    return {
      user: { ...userObj },
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User): Promise<UserApiResponse> {
    return { user: { ...user }, token: this.getJwtToken({ id: user.id }) };
  }

  async forgotPassword(emailDto: EmailDto): Promise<{ message: string }> {
    const { email } = emailDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('user not found');
    try {
      const createToken = this.createToken();
      user.passwordResetToken = this.createHashedToken(createToken);
      //10 minutes
      const timestamp = Date.now() + 10 * 60 * 1000; // Calculate the timestamp
      user.passwordResetExpires = new Date(timestamp);
      user.save();

      this.sendEmailService.resetPasswordEmail(
        { email },
        createToken,
        user.name,
      );

      return {
        message: 'Reset token password has been sent',
      };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(
    tokenDto: TokenDto,
    resetpasswordDto: ResetPasswordDto,
  ): Promise<UserApiResponse> {
    const { token } = tokenDto;
    const { password } = resetpasswordDto;
    const hashedToken = this.createHashedToken(token);

    const user = await this.userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new BadRequestException('Invalid token or expired');
    user.password = this.hashPassword(password);
    user.passwordChangedAt = Date.now() - 1000;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    user.save();

    const userObj = user.toObject();
    delete userObj.password;
    return {
      user: { ...userObj },
      token: this.getJwtToken({ id: user.id }),
    };
  }

  createToken(): string {
    return randomBytes(32).toString('hex');
  }
  createHashedToken(resetToken: string): string {
    //cambiar a bcrypt
    const hashedToken = createHash('sha256').update(resetToken).digest('hex');
    return hashedToken;
  }
}
