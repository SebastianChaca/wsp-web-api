import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FriendParamsDto extends PartialType(PaginationDto) {
  // Other properties

  @IsOptional()
  lastmessage?: boolean;
}
