import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthService } from 'src/api/auth/auth.service';
import { SendEmailService } from '../send-email/send-email.service';
import { UserApiResponse } from './interfaces/userApiResponse.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(User.name);
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
    private readonly sendEmailServide: SendEmailService,
    private readonly imageService: ImagesService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserApiResponse> {
    try {
      this.logger.log('Create user');
      createUserDto.password = this.authService.hashPassword(
        createUserDto.password,
      );
      const user = await this.userModel.create(createUserDto);
      const userObj = user.toObject();
      delete userObj.password;
      this.sendEmailServide.userCreationEmail({ email: user.email });
      //TODO: verificar cuenta
      return {
        user: { ...userObj },
        token: this.authService.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.logger.error('Create user error');
      //handle by unique constraing filter
      throw error;
    }
  }

  async updateAvatar(userID: string, photoID: string) {
    const folder = `${userID}/avatar`;
    this.logger.log('find if user have an avatar image');
    //search if the user already have an image saved using user id as reference
    const findPhoto = await this.imageService.findReference(userID, folder);
    console.log(findPhoto);
    if (findPhoto) {
      this.logger.log('Remove reference to unused image');
      //if user have an avatar image, remove reference so the image will be deleted by CRON job
      await this.imageService.addReference(null, findPhoto.id);
    }
    this.logger.log('Add new image');
    await this.imageService.addReference(userID, photoID);
  }

  async update(userID: string, updateUserDto: UpdateUserDto) {
    const photoID = updateUserDto.image;
    const password = updateUserDto.password;

    if (password) {
      return 'Password change not implemented';
    }

    try {
      this.logger.log('Update user');
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userID,
          { ...updateUserDto },
          { new: true, runValidators: true }, // `new` returns the updated document, `runValidators` ensures schema validations are applied
        )
        .populate('image');
      if (!updatedUser) {
        throw new Error(`User with ID ${userID} not found`);
      }

      if (photoID) {
        await this.updateAvatar(userID, photoID);
      }

      return updatedUser;
    } catch (error) {
      this.logger.error('Update user error');

      throw error;
    }
  }
}
