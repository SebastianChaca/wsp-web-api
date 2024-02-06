import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiResponse({
    description:
      'generetes user, friends and message using resoruces from data folder inside seed module',
  })
  @Post()
  create() {
    return this.seedService.create();
  }
}
