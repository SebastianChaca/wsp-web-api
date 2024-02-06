import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/api/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { id, iat } = payload;

    const user = await this.userModel.findOne({ _id: id });

    const changedTimestamp = user.passwordChangedAt / 1000;

    if (iat < changedTimestamp)
      throw new UnauthorizedException('Password has changed');
    if (!user) throw new UnauthorizedException('Token invalid');
    if (!user.isActive) throw new UnauthorizedException('User inactive');
    return user.toObject();
  }
}
