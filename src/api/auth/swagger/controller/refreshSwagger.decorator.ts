import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function RefreshSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 401, description: 'User Inactive' }),
  );
}
