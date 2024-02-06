import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/api/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/api/user/entities/user.entity';
import { Friend, FriendSchema } from 'src/api/friend/entities/friend.entity';

@Module({
  providers: [EventsGateway, JwtService],
  exports: [EventsGateway],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Friend.name, schema: FriendSchema }]),
    AuthModule,
  ],
})
export class EventsModule {}
