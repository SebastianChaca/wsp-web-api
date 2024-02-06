import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from '../entities/friend.entity';
import { Model } from 'mongoose';

@Injectable()
export class FriendutilsService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
  ) {}

  async checkRelationAndStatus(from: string, to: string) {
    const relationExist = await this.friendModel.findOne({
      userId: from,
      friendId: to,
    });
    if (!relationExist) throw new BadRequestException('No friendship found');
    if (relationExist.status === 2) {
      throw new BadRequestException('not allowed');
    }
  }
  checkFriendshipStatus(status: number) {
    if (status === 2) {
      throw new BadRequestException('not allowed');
    }
  }
  async updateNotification(from: string, to: string) {
    await this.friendModel.updateOne(
      { userId: to, friendId: from },
      { $inc: { notifications: 1 } },
    );
  }
}
