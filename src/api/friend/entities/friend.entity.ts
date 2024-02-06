import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/api/user/entities/user.entity';
export type FriendDocument = Friend & mongoose.Document;
@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      // delete ret.password;
      delete ret.__v;
    },
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      //delete ret.password;
      delete ret.__v;
    },
  },
})
export class Friend {
  @ApiProperty({
    example: '6541ad729d7d41d1d9dfb6e0',
    description: ' id',
    uniqueItems: true,
  })
  id: string;

  @ApiProperty({
    description: 'user',
    example: '6542e38d81d02967f65f7402',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: User;

  @ApiProperty({
    description: 'friend',
    example: '6542e38d81d02967f65f7401',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  friendId: User;

  @ApiProperty({
    example: 1,
    description: 'number of notifications messages pending to read',
  })
  @Prop({ default: 0 })
  notifications: number;

  @ApiProperty({
    example: true,
    description: 'if that friend is requesting to reach you',
  })
  @Prop({ default: false })
  isRequesting: boolean;

  @ApiProperty({
    example: 1,
    description: 'friendship status: 0: requested, 1:accepted: 2: blocked',
  })
  @Prop({ default: 0, enum: [0, 1, 2] })
  status: number;

  @ApiProperty({
    example: false,
    description: 'if status === 0',
  })
  isPending: boolean;

  @ApiProperty({
    example: false,
    description: 'if status === 1',
  })
  isAccepted: boolean;
  @ApiProperty({
    example: false,
    description: 'if status === 1',
  })
  isBlocked: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

FriendSchema.virtual('isPending').get(function () {
  return this.status === 0;
});
FriendSchema.virtual('isAccepted').get(function () {
  return this.status === 1;
});
FriendSchema.virtual('isBlocked').get(function () {
  return this.status === 2;
});
