import { IsString } from 'class-validator';
export class CreateImageDto {
  @IsString()
  folder: string;
}
