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
      this.logger.log('Upload image to cloudinary');
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            this.logger.error('Upload image to cloudinary error');
            return reject(error);
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async create(
    url: string,
    secureUrl: string,
    folder: string,
    publicID: string,
  ) {
    try {
      this.logger.log('Create image in db');

      const createImage = await this.imageModel.create({
        url,
        secureUrl,
        folder,
        publicID,
      });
      return {
        id: createImage.id,
        secureUrl: createImage.secureUrl,
      };
    } catch (error) {
      this.logger.error('Create image in db error');
      throw error;
    }
  }

  async addReference(reference: string | null, photoId: string) {
    try {
      this.logger.log('Update image reference');
      return await this.imageModel.findByIdAndUpdate(
        photoId,
        { reference },
        { new: true },
      );
    } catch (error) {
      this.logger.error('Update reference image error');
      throw error;
    }
  }

  async findReference(reference: string, folder: string) {
    try {
      this.logger.log('Find image reference in db');
      return await this.imageModel.findOne({ reference, folder });
    } catch (error) {
      this.logger.error('Find image reference in db error');
      throw error;
    }
  }

  async findImagesWithoutReference() {
    try {
      this.logger.log('Find image without reference in db');
      return (await this.imageModel.find({ reference: null }).exec()).map(
        (element) => element.publicID,
      );
    } catch (error) {
      this.logger.error('Find image without reference in db error');
      throw error;
    }
  }

  async removeImagesByPublicIDs(publicIDs: string[]) {
    try {
      this.logger.log(`Removing images with publicIDs: ${publicIDs} in db`);
      const result = await this.imageModel
        .deleteMany({ publicID: { $in: publicIDs } })
        .exec();
      this.logger.log(`${result.deletedCount} images removed`);
      return result;
    } catch (error) {
      this.logger.error('Error removing images by publicIDs', error);
      throw error;
    }
  }
  async removeImagesFromCloud(publicIDs: string[]) {
    try {
      this.logger.log(`Removing images with publicIDs: ${publicIDs} in cloud`);
      await cloudinary.api.delete_resources(publicIDs);
    } catch (error) {
      this.logger.error('Error removing images by publicIDs', error);
      throw error;
    }
  }
}
