import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Friend } from '../../entities/friend.entity';

export function CreateSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'add a friend to list',
      type: Friend,
    }),
    ApiResponse({
      status: 400,
      description: 'invalid email',
      type: Friend,
    }),
  );
}
