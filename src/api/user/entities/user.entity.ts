import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
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
      delete ret.password;
      delete ret.__v;
    },
  },
})
export class User {
  @ApiProperty({
    example: '6541ad729d7d41d1d9dfb6e0',
    description: 'user id',
    uniqueItems: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  id: string;

  @ApiProperty({
    example: 'Sebastian',
    description: 'user name',
  })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'Sebastian@g.com',
    description: 'user email',
  })
  @Prop({ lowercase: true, unique: true, required: true })
  email: string;

  @ApiProperty({
    example: 'Hola1234',
    description: 'user password',
  })
  @Prop()
  password: string;

  @ApiProperty({
    example: 'true',
    description: 'user chat satus',
  })
  @Prop({ default: false })
  online: boolean;

  @ApiProperty({
    example: '2023-11-01T01:44:18.657Z',
    description: 'user last active date',
  })
  @Prop({ default: null })
  lastActive: string;

  @ApiProperty({
    example: 'true',
    description: 'if current user is active',
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    example: '[admin]',
    description: 'user roles',
    enum: ['admin', 'user', 'super-admin'],
  })
  @Prop({ default: 'user', enum: ['user', 'admin', 'super-admin'] })
  roles: string;

  createdAt: Date;
  updatedAt: Date;

  @ApiProperty({
    example: 'sdasdasdasdasd',
    description: 'token for password change',
  })
  @Prop()
  passwordResetToken: string;

  @ApiProperty({
    description: 'date of the password change',
  })
  @Prop()
  passwordChangedAt: number;
  @ApiProperty({
    description: 'date when the token expires',
  })
  @Prop()
  passwordResetExpires: Date;

  @ApiProperty({
    description: 'if current user is an admin',
  })
  isAdmin: boolean;

  @ApiProperty({
    description: 'if current user is a super admin',
  })
  isSuperAdmin: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: false,
    default: null,
  })
  image: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('isAdmin').get(function () {
  return this.roles === 'admin';
});
UserSchema.virtual('isSuperAdmin').get(function () {
  return this.roles === 'super-admin';
});

UserSchema.virtual('hasImage').get(function () {
  return !!this.image;
});
