import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { users } from './data/user';
import { Friend } from '../friend/entities/friend.entity';
import { Message } from '../message/entities/message.entity';
import { messages } from './data/messages';
import { ConfigService } from '@nestjs/config';
import { DEVELOPMENT, NODE_ENV } from 'src/common/constants/envvars';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}
  async create() {
    if (this.configService.get(NODE_ENV) === DEVELOPMENT) {
      try {
        await this.emptyDB();
        await this.createSeed();
        return 'ok';
      } catch (error) {
        throw error;
      }
    } else {
      return 'Seed only works in development mode';
    }
  }

  async createSeed() {
    try {
      const createUsers = users.map(async (user) => {
        user.password = this.authService.hashPassword(user.password);
        return await this.userModel.create(user);
      });
      const usersDB = await Promise.all(createUsers);
      const adminUser = usersDB.find((user) => user.email === users[0].email);
      const findFriend = usersDB.find((user) => user.email === users[1].email);

      //adds friends to admin@test.com user
      const addFriendsToTestUser = usersDB.map(async (user) => {
        if (user.email !== adminUser.email && user.email !== users[5].email) {
          return await this.friendModel.create({
            userId: adminUser.id,
            friendId: user.id,
            status: 1,
          });
        }
      });
      // ads admin@test.com to test@test.com friend list
      const addTestUserToFriendList = usersDB.map(async (user) => {
        if (user.email === users[1].email) {
          return await this.friendModel.create({
            userId: user.id,
            friendId: adminUser.id,
            status: 1,
          });
        }
      });
      await Promise.all(addFriendsToTestUser);
      await Promise.all(addTestUserToFriendList);
      const seedMessages = messages();

      for (let index = 0; index < seedMessages.length; index++) {
        const msg = seedMessages[index];

        index % 2 === 0
          ? await this.messageModel.create({
              to: findFriend.id,
              from: adminUser.id,
              message: msg,
            })
          : await this.messageModel.create({
              to: adminUser.id,
              from: findFriend.id,
              message: msg,
            });
      }
    } catch (error) {
      throw error;
    }
  }

  async emptyDB() {
    try {
      await this.userModel.deleteMany();
      await this.friendModel.deleteMany();
      await this.messageModel.deleteMany();
    } catch (error) {
      throw error;
    }
  }
}
