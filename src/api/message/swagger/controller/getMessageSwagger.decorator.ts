import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { Message } from '../../entities/message.entity';

export function GetMessagesSwaggerDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'get messages between friends',
      type: Message,
    }),
    ApiParam({
      name: 'id',
      description: 'must be mongo ids only',
      example: '6542e38d81d02967f65f7402',
    }),
  );
}
