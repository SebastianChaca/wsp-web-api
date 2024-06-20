import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ImagesService } from 'src/api/images/images.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly imageService: ImagesService) {}
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async removeUnusedImages() {
    try {
      this.logger.log('Start task for removing images without reference');
      const publicIds = await this.imageService.findImagesWithoutReference();

      if (publicIds.length > 0) {
        await this.imageService.removeImagesFromCloud(publicIds);
        await this.imageService.removeImagesByPublicIDs(publicIds);
      }
    } catch (error) {
      throw error;
    }
  }
}
