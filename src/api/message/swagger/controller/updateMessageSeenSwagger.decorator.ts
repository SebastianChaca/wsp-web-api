import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function UpdatMessageSeenSwagger() {
  return applyDecorators(
    ApiProperty({
      description: 'update if message has been seen by the user',
    }),
  );
}
