import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export function CreateUserSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'user created',
      type: User,
    }),
    ApiResponse({
      status: 400,
      description: 'user alredy exist',
      type: User,
    }),
  );
}
