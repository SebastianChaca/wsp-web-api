import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { User } from 'src/api/user/entities/user.entity';

export function LoginSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({ status: 201, description: 'User was logged in', type: User }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
