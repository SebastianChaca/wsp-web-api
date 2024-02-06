import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Friend } from '../../entities/friend.entity';

export function FindFriendsSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description:
        'get list of user friends with the last message between them',
      type: Friend,
    }),
  );
}
