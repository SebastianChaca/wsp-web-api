import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { CloudinaryProvider } from './cloudinary/cloudinary';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from './entities/image.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, CloudinaryProvider],
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    AuthModule,
  ],
  exports: [ImagesService],
})
export class ImagesModule {}
