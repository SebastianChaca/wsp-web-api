import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ForgoPasswordSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Creates token to reset password',
    }),
    ApiResponse({ status: 400, description: 'invalid email' }),
  );
}
