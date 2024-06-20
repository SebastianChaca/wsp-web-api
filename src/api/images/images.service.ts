import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
import * as streamifier from 'streamifier';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from './entities/image.entity';
@Injectable()
export class ImagesService {
  private readonly logger = new Logger(Image.name);
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
  ) {}
  cloudinaryUpload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      this.logger.log('upload image to cloudinary');
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            this.logger.error('upload image to cloudinary error');
            return reject(error);
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async create(url: string, secureUrl: string, folder: string) {
    try {
      this.logger.log('create image in db');

      const createImage = await this.imageModel.create({
        url,
        secureUrl,
        folder,
      });
      return {
        id: createImage.id,
        secureUrl: createImage.secureUrl,
      };
    } catch (error) {
      this.logger.error('create image in db error');
      throw error;
    }
  }

  async addReference(reference: string | null, photoId: string) {
    try {
      this.logger.log('update image reference');
      return await this.imageModel.findByIdAndUpdate(
        photoId,
        { reference },
        { new: true },
      );
    } catch (error) {
      this.logger.error('update reference image error');
      throw error;
    }
  }

  async findReference(reference: string, folder: string) {
    return await this.imageModel.findOne({ reference, folder });
  }
}
