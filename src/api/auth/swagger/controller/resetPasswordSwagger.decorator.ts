import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ResetPasswordSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Update new password and return user with token',
    }),
    ApiResponse({ status: 400, description: 'invalid token or expired' }),
  );
}
