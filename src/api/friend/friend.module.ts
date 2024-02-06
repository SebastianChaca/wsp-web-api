import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.entity';
import { Message, MessageSchema } from '../message/entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { Friend, FriendSchema } from './entities/friend.entity';
import { MessageService } from '../message/message.service';
import { EventsGateway } from 'src/events/events.gateway';
import { EventsModule } from 'src/events/events.module';
import { FriendutilsService } from './friendutils/friendutils.service';

@Module({
  controllers: [FriendController],
  providers: [FriendService, MessageService, EventsGateway, FriendutilsService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Friend.name, schema: FriendSchema },
    ]),
    AuthModule,
    EventsModule,
  ],
  exports: [FriendService, FriendutilsService],
})
export class FriendModule {}
