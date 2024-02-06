import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/api/user/entities/user.entity';
export type MessageDocument = Message & mongoose.Document;
@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      ret.iconReactions.id = ret.iconReactions._id;
      delete ret._id;

      delete ret.__v;
    },
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      ret.iconReactions.id = ret.iconReactions._id;
      delete ret._id;

      delete ret.__v;
    },
  },
})
export class Message {
  id: string;

  @ApiProperty({
    description: 'from whom is the message',
    example: '6542e38d81d02967f65f7402',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  from: User;

  @ApiProperty({
    description: 'to whom is the message',
    example: '6542e38d81d02967f65f7402',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  to: User;

  @ApiProperty({
    description: 'chat message',
    example: 'hey !',
  })
  @Prop({ required: true })
  message: string;

  @ApiProperty({
    description: 'chat message status',
    example: false,
  })
  @Prop({ default: false, required: false })
  seen: boolean;

  @ApiProperty({
    description: 'response to message',
    example: 'hi !',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: false,
    default: null,
  })
  responseTo: MessageDocument;

  createdAt: Date;
  updatedAt: Date;

  @Prop({
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        icon: { type: String },
        craetedAt: { type: Date, default: Date.now },
      },
    ],
  })
  iconReactions: { user: User; icon: string; createdAt: Date }[];
}
export const MessageSchema = SchemaFactory.createForClass(Message);
