import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from './dto/create-image.dto';
import { Auth } from '../auth/decorators/auth.decorator';
// import { UpdateImageDto } from './dto/update-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 300000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
  ) {
    const cloudinaryImage = await this.imagesService.cloudinaryUpload(
      image,
      createImageDto.folder,
    );
    return await this.imagesService.create(
      cloudinaryImage.url,
      cloudinaryImage.secure_url,
      createImageDto.folder,
    );
  }
}
