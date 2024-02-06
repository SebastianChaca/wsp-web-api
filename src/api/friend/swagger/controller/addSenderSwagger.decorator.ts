import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Friend } from '../../entities/friend.entity';

export function AddSenderSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'add sender to friend to list',
      type: Friend,
    }),
    ApiResponse({
      status: 400,
      description: 'invalid friend id',
      type: Friend,
    }),
    ApiResponse({
      status: 400,
      description: 'frist add this friend to your friends list',
      type: Friend,
    }),
    ApiResponse({
      status: 400,
      description: 'sender was already added to friend list',
      type: Friend,
    }),
  );
}
