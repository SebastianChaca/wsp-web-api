import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
@Schema({ timestamps: true })
export class Image {
  @ApiProperty({
    example: '6541ad729d7d41d1d9dfb6e0',
    description: 'photo id',
    uniqueItems: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  id: string;

  @ApiProperty({
    example: '6541ad729d7d41d1d9dfb6e0',
    description: 'photo public id',
    uniqueItems: true,
  })
  @Prop()
  publicID: string;

  @ApiProperty({
    example: 'http://',
    description: 'photo url',
  })
  @Prop()
  url: string;

  @ApiProperty({
    example: 'http://',
    description: 'photo secure url',
  })
  @Prop()
  secureUrl: string;

  @ApiProperty({
    example: 'messages/userID',
    description: 'folder where image is stored',
  })
  @Prop()
  folder: string;

  @ApiProperty({
    example: '6541ad729d7d41d1d9dfb6e0',
    description:
      'id of the resource wich is bound to the image, if is empty means that the image is not being used and should be deleted',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
  })
  reference: string;

  createdAt: Date;
  updatedAt: Date;
}
export const ImageSchema = SchemaFactory.createForClass(Image);
