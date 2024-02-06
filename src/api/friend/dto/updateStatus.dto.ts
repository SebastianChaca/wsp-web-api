import { IsIn, IsInt } from 'class-validator';

export class UpdateStatusDto {
  @IsInt()
  @IsIn([0, 1, 2])
  status: number;
}
