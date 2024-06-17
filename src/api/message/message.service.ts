import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateMessageSeen } from './dto/update-message-seen.dto';
import { EventsGateway } from 'src/events/events.gateway';
import { FriendutilsService } from '../friend/friendutils/friendutils.service';
import { Pagination } from 'src/common/interfaces/totalPagination.interface';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(Message.name);
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    private readonly eventGateway: EventsGateway,
    private readonly friendUtilsService: FriendutilsService,
    private readonly imageService: ImagesService,
  ) {}
  async create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    this.logger.log('create message');
    const { to, from, message, responseTo, image } = createMessageDto;
    await this.friendUtilsService.checkRelationAndStatus(from, to);
    try {
      const createMessage = await this.messageModel.create({
        to,
        from,
        message,
        responseTo,
        image,
      });

      await this.imageService.addReference(createMessage.id, image);

      await this.messageModel.populate(createMessage, [
        { path: 'to' },
        { path: 'from' },
        { path: 'responseTo' },
        { path: 'image' },
      ]);
      //update notif
      await this.friendUtilsService.updateNotification(from, to);
      //socket
      this.eventGateway.sendMessage(createMessage.toObject());

      return createMessage;
    } catch (error) {
      this.logger.error('create message error');
      throw error;
    }
  }

  async findAll(
    user: User,
    id: string,
    paginationDto: PaginationDto,
  ): Promise<Pagination & { messages: MessageDocument[] }> {
    this.logger.log('search messages');
    const { limit = 15, page = 1 } = paginationDto;
    try {
      const query = {
        $or: [
          { from: user.id, to: id },
          { from: id, to: user.id },
        ],
      };
      const currentPage = page - 1;
      const totalMessages = await this.messageModel.countDocuments(query);

      const findMessages = await this.messageModel
        .find(query)
        .sort({ createdAt: 'desc' })
        .populate('to', '-roles -isActive -online -lastActive')
        .populate('from', '-roles -isActive -online -lastActive')
        .populate('responseTo', '-responseTo -from -to -seen')
        .populate('iconReactions.user', 'id name email')
        .populate('image', 'secureUrl reference')
        .limit(limit)
        .skip(currentPage * limit);
      return {
        totalPages: Math.ceil(totalMessages / limit),
        currentPage: page,
        messages: findMessages,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateIconReaction(
    id: string,
    updateMessageDto: UpdateMessageDto,
    user: User,
  ) {
    this.logger.log('update message icon');

    try {
      const message = await this.messageModel.findById(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      const populatedMessage = await this.messageModel.populate(message, {
        path: 'from to iconReactions.user responseTo',
        // select: 'name email id',
      });

      await this.friendUtilsService.checkRelationAndStatus(
        message.from.id,
        message.to.id,
      );

      const userIndex = populatedMessage.iconReactions.findIndex(
        (reaction) => reaction.user.id === user.id.toString(),
      );

      if (userIndex !== -1) {
        message.iconReactions[userIndex].icon = updateMessageDto.iconReactions;
      } else {
        message.iconReactions.push({
          user: user,
          icon: updateMessageDto.iconReactions,
          createdAt: new Date(),
        });
      }

      const updatedMessage = await populatedMessage.save();

      function findOtherUserId(message: any, userId: string): string | null {
        if (message.from.id !== userId) {
          return message.from.id;
        } else if (message.to.id !== userId) {
          return message.to.id;
        } else {
          return null;
        }
      }
      const friendId = findOtherUserId(updatedMessage, user.id.toString());

      this.eventGateway.sendMessageIconReaction(updatedMessage, friendId);
      return updatedMessage;
    } catch (error) {
      this.logger.error('update message icon reaction error');
      throw error;
    }
  }

  async getLastMessage(
    userId: string,
    friendId: string,
  ): Promise<MessageDocument> {
    return await this.messageModel
      .findOne({
        $or: [
          { from: userId, to: friendId },
          { from: friendId, to: userId },
        ],
      })
      .sort({ createdAt: 'desc' })
      .select('-responseTo')
      .limit(1);
  }

  async updateSeenMessages(
    updateMessageSeen: UpdateMessageSeen,
    id: string,
    user: User,
  ) {
    await this.friendUtilsService.checkRelationAndStatus(user.id, id);
    try {
      await this.messageModel.updateMany(
        { _id: { $in: updateMessageSeen.messagesId } },
        { $set: { seen: true } },
        { new: true },
      );
      const updatedMessages = await this.messageModel
        .find({
          _id: { $in: updateMessageSeen.messagesId },
        })
        .populate('to', '-roles -isActive -online -lastActive')
        .populate('from', '-roles -isActive -online -lastActive')
        .populate('responseTo', '-responseTo -from -to -seen')
        .populate('iconReactions.user', 'id name email _id')
        .sort({ createdAt: 'desc' });

      this.eventGateway.sendSeenMessages(updatedMessages, id);
      return updatedMessages;
    } catch (error) {}
  }

  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}
