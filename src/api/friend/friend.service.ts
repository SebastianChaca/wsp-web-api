import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friend, FriendDocument } from './entities/friend.entity';
import { User } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Message } from '../message/entities/message.entity';
import { FriendApiResponse } from './interfaces/friendApiResponse.interface';
import { MessageService } from '../message/message.service';
import { AddSenderDto, UpdateStatusDto } from './dto';
import { EventsGateway } from 'src/events/events.gateway';
import { GetAllFriends } from './interfaces/getAllFriendsApiResponse.interface';

@Injectable()
export class FriendService {
  private readonly logger = new Logger(Friend.name);
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly messageService: MessageService,
    private readonly eventGateway: EventsGateway,
  ) {}

  async createFriendAndSerialize(
    userId: string,
    friendId: string,
    isRequesting?: boolean,
  ): Promise<FriendApiResponse> {
    const createFriend = await this.friendModel.create({
      userId,
      friendId,
      isRequesting,
    });

    const populatedFriend = await this.friendModel.populate(createFriend, [
      { path: 'friendId', select: '-password' },
    ]);

    return this.serializeFriendResponse(populatedFriend);
  }
  //first step: user add a friend to his friends list only with email
  async create(
    createFriendDto: CreateFriendDto,
    user: User,
  ): Promise<FriendApiResponse> {
    const { email } = createFriendDto;
    this.logger.log('Create friend');
    if (email === user.email) throw new BadRequestException('invalid email');

    try {
      const friend = await this.userModel.findOne({ email });
      if (!friend) throw new BadRequestException('invalid email');

      const relationExist = await this.friendModel.findOne({
        userId: user.id,
        friendId: friend.id,
      });
      if (relationExist) throw new BadRequestException('Relation alredy exist');

      return await this.createFriendAndSerialize(user.id, friend.id);
    } catch (error) {
      this.logger.error('Create friend error');
      throw error;
    }
  }
  //second step: add sender to addressee friends list
  async addSenderToFriendsList(
    addsenderDto: AddSenderDto,
    user: User,
  ): Promise<FriendApiResponse> {
    const { friendId } = addsenderDto;
    this.logger.log('add sender to friend list');
    try {
      const friend = await this.userModel.findOne({ _id: friendId });
      if (!friend) throw new BadRequestException('invalid friend id');

      const checkIfFriendWasAdded = await this.friendModel.findOne({
        userId: user.id,
        friendId: friend.id,
      });

      if (!checkIfFriendWasAdded)
        throw new BadRequestException(
          'frist add this friend to your friends list',
        );

      const checkIfSenderWasAdded = await this.friendModel.findOne({
        userId: friendId,
        friendId: user.id,
      });

      if (checkIfSenderWasAdded) {
        throw new BadRequestException(
          'sender was already added to friend list',
        );
      }

      return await this.createFriendAndSerialize(friendId, user.id, true);
    } catch (error) {
      this.logger.error('add sender error');
      throw error;
    }
  }

  serializeFriendResponse(friend: FriendDocument): FriendApiResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { friendId, userId, ...restFriend } = friend.toObject();

    return {
      user: friendId,
      ...restFriend,
    };
  }
  async getFriendById(
    friendIdParam: string,
    userId: string,
  ): Promise<Promise<{ lastMessage: Message } | FriendApiResponse>> {
    this.logger.log('search friend by id');
    try {
      const findFriend = await this.friendModel
        .findOne({
          userId,
          friendId: friendIdParam,
        })
        .populate('friendId', '-roles -password')
        .select('-userId');

      const findMessage = await this.messageService.getLastMessage(
        userId,
        friendIdParam,
      );
      return {
        ...this.serializeFriendResponse(findFriend),
        lastMessage: findMessage,
      };
    } catch (error) {
      this.logger.error('search friend by id error');
      throw error;
    }
  }

  async allFriendsWithLastMessage(friends: FriendDocument[], user: User) {
    const addLastMessage = friends.map(async (friend) => {
      if (typeof friend !== 'string') {
        const friendIDD = friend.friendId.id;
        const findMessage = await this.messageService.getLastMessage(
          user.id,
          friendIDD,
        );

        return {
          friend,
          lastMessage: findMessage,
        };
      }
    });
    return await Promise.all(addLastMessage);
  }

  async findAllFriends(
    user: User,
    paginationDto: PaginationDto,
  ): Promise<GetAllFriends> {
    this.logger.log('search friends');
    const { limit = 15, page = 1 } = paginationDto;

    try {
      const query = { userId: user.id };
      const currentPage = page - 1;
      const totalFriends = await this.friendModel.countDocuments(query);
      const friends = await this.friendModel
        .find(query)
        .limit(limit)
        .skip(currentPage * limit)
        .populate('friendId', '-roles -password')
        .select('-userId')
        .sort({ updatedAt: -1 });
      const friendsWithLastMessage = await this.allFriendsWithLastMessage(
        friends,
        user,
      );
      return {
        totalPages: Math.ceil(totalFriends / limit),
        currentPage: page,
        friends: friendsWithLastMessage.map((obj) => {
          const { lastMessage, friend } = obj;
          return {
            ...this.serializeFriendResponse(friend),
            lastMessage,
          };
        }),
      };
    } catch (error) {
      this.logger.error('search friends error');
      throw error;
    }
  }
  //TODO:ver despues si deberia popular esto
  update(
    id: string,
    updateFriendDto: UpdateFriendDto,
    userId: string,
  ): Promise<Friend> {
    this.logger.log('update friend');
    try {
      const friend = this.friendModel.findOneAndUpdate(
        { friendId: id, userId },
        updateFriendDto,
        { new: true },
      );
      return friend;
    } catch (error) {
      this.logger.error('update friends error');
      throw error;
    }
  }

  async updateStatus(
    user: User,
    updateStatusDto: UpdateStatusDto,
    id: string,
  ): Promise<FriendApiResponse> {
    try {
      const findIfBothAreFriends = await this.friendModel.find({
        $or: [
          { friendId: id, userId: user.id },
          { friendId: user.id, userId: id },
        ],
      });

      if (findIfBothAreFriends.length !== 2) {
        throw new BadRequestException(
          'users must be friends to perform this update',
        );
      }

      const updateFriend = await this.friendModel
        .findOneAndUpdate(
          { friendId: id, userId: user.id },
          { ...updateStatusDto, isRequesting: false },
          { new: true },
        )
        .populate({ path: 'friendId', select: '-password' });

      const updateUserStatus = await this.friendModel
        .findOneAndUpdate(
          { friendId: user.id, userId: id },
          { ...updateStatusDto, isRequesting: false },
          { new: true },
        )
        .populate({ path: 'friendId', select: '-password' });

      const friendApiResponse = this.serializeFriendResponse(updateUserStatus);
      this.eventGateway.sendUpdatedFriendStatus(friendApiResponse, id);

      return this.serializeFriendResponse(updateFriend);
    } catch (error) {
      throw error;
    }
  }

  async checkIfRelationExist(from: string, to: string) {
    const relationExist = await this.friendModel.findOne({
      userId: from,
      friendId: to,
    });
    if (!relationExist) throw new BadRequestException('No friendship found');
  }

  checkFriendshipStatus(status: number) {
    if (status === 2) {
      throw new BadRequestException('not allowed');
    }
  }
  //TODO:agregar delete pero solo para admins
}
