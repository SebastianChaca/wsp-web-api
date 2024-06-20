import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ImagesService } from 'src/api/images/images.service';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly imageService: ImagesService) {}
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async removeUnusedImages() {
    try {
      this.logger.log('Start task for removing images without reference');
      const findImageWithoutReference =
        await this.imageService.findImagesWithoutReference();

      if (findImageWithoutReference.length > 0) {
        await cloudinary.api.delete_resources(findImageWithoutReference);
        await this.imageService.removeImagesByPublicIDs(
          findImageWithoutReference,
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
