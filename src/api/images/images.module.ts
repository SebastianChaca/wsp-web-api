import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { CloudinaryProvider } from './cloudinary/cloudinary';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, CloudinaryProvider],
})
export class ImagesModule {}
