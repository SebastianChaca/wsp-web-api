import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Friend } from '../../entities/friend.entity';

export function GetFriendByIdSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'find friend by id',
      type: Friend,
    }),
  );
}
