import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientToServer, ServerToClient } from './interfaces/serverToclient';
import { JwtService } from '@nestjs/jwt';
import { Logger, UseGuards } from '@nestjs/common';
import { SocketAuthMiddleware } from 'src/api/auth/ws-jwt/ws.mw';
import { WsJwtGuard } from 'src/api/auth/ws-jwt/ws-jwt.guard';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/api/user/entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  PopulatedMessage,
  isTyping,
} from './interfaces/message-populated.interface';
import { Friend } from 'src/api/friend/entities/friend.entity';
import { FriendApiResponse } from 'src/api/friend/interfaces/friendApiResponse.interface';

@WebSocketGateway({
  namespace: 'events',
  cors: true,
})
@UseGuards(WsJwtGuard)
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger;
  private loggedInUser: User;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
  ) {}

  @WebSocketServer()
  server: Server<ClientToServer, ServerToClient>;

  async handleConnection(client: Socket) {
    try {
      const { id } = this.getUserId(client);
      const user = await this.findUserAndUpdateOnlineStatus(id, {
        online: true,
      });
      client.join(user.id.toString());
      await this.updateOnlineStatus(user);
    } catch (error) {
      client.disconnect();
      throw error;
    }
  }
  async handleDisconnect(client: Socket) {
    try {
      const { id } = this.getUserId(client);
      const user = await this.findUserAndUpdateOnlineStatus(id, {
        online: false,
        lastActive: new Date().toString(),
      });
      await this.updateOnlineStatus(user);
      client.disconnect();
    } catch (error) {
      client.disconnect();
      throw error;
    }
  }
  afterInit(client: Socket) {
    //TODO:agregar modelo de usuario
    client.use(
      SocketAuthMiddleware(
        this.jwtService,
        this.configService,
        this.userModel,
      ) as any,
    );
  }

  sendMessageIconReaction(message: PopulatedMessage, id: string) {
    this.server.to(id).emit('update-message-reaction', message);
  }

  sendSeenMessages(messages: PopulatedMessage[], id: string) {
    this.server.to(id).emit('seen-messages', messages);
  }

  sendMessage(message: PopulatedMessage) {
    this.server.to(message.to.id.toString()).emit('personal-message', message);
  }

  sendUpdatedFriendStatus(friend: FriendApiResponse, to: string) {
    this.server.to(to).emit('update-friend-status', friend);
  }

  @SubscribeMessage('typing')
  userIsTyping(client: Socket, payload: isTyping) {
    this.server.to(payload.to).emit('typing', payload);
  }

  private async updateOnlineStatus(user: User) {
    const friendsIds = await this.findUserFriendsIds(user.id);
    this.server.to(friendsIds).emit('friend-online-status', {
      uid: user.id,
      online: user.online,
      lastActive: user.lastActive,
    });
  }
  private getUserId(client: Socket) {
    const token = client?.handshake?.query?.token as string;
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('jwt.secret'),
    });
    return payload;
  }
  private async findUserAndUpdateOnlineStatus(
    id: string,
    update: { online: boolean; lastActive?: string },
  ) {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: id,
      },
      { online: update.online, lastActive: update.lastActive },
      { new: true },
    );
    return user;
  }
  private async findUserFriendsIds(id: string) {
    const friends = await this.friendModel.find({ userId: id });
    const friendsIds = friends.map((friend) => friend.friendId.toString());
    return friendsIds;
  }
}
