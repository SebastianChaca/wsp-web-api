import { applyDecorators } from '@nestjs/common';
import { Message } from '../../entities/message.entity';
import { ApiResponse } from '@nestjs/swagger';

export function CreateMessageSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'message created',
      type: Message,
    }),
  );
}
