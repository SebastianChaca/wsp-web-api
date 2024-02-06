import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.entity';
import { Message, MessageSchema } from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from 'src/events/events.module';
import { Friend, FriendSchema } from '../friend/entities/friend.entity';
import { FriendutilsService } from '../friend/friendutils/friendutils.service';
import { FriendModule } from '../friend/friend.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService, FriendutilsService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Friend.name, schema: FriendSchema },
    ]),
    AuthModule,
    EventsModule,
    FriendModule,
  ],
  exports: [MessageService],
})
export class MessageModule {}
