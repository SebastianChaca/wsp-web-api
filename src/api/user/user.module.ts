import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { AuthModule } from 'src/api/auth/auth.module';
import { SendEmailService } from '../send-email/send-email.service';
import { ImagesModule } from '../images/images.module';

@Module({
  controllers: [UserController],
  providers: [UserService, SendEmailService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    ImagesModule,
  ],
  exports: [UserModule],
})
export class UserModule {}
