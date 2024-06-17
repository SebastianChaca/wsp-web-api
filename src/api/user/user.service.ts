import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthService } from 'src/api/auth/auth.service';
import { SendEmailService } from '../send-email/send-email.service';
import { UserApiResponse } from './interfaces/userApiResponse.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(User.name);
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
    private readonly sendEmailServide: SendEmailService,
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      this.logger.log('Update user');
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { ...updateUserDto },
        { new: true, runValidators: true }, // `new` returns the updated document, `runValidators` ensures schema validations are applied
      );
      if (!updatedUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      this.logger.error('Update user error');

      throw error;
    }
  }
}
