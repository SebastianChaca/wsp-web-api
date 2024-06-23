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
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

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
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg)' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
    @GetUser() user: User,
  ) {
    //TODO: remove user.id for a better id, exposing DB Ids is bad idea.
    const folderWithId = `${user.id}/${createImageDto.folder}`;
    const cloudinaryImage = await this.imagesService.cloudinaryUpload(
      image,
      folderWithId,
    );

    return await this.imagesService.create(
      cloudinaryImage.url,
      cloudinaryImage.secure_url,
      folderWithId,
      cloudinaryImage.public_id,
    );
  }
}
