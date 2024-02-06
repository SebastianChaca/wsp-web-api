import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UniqueConstraintFilter } from 'src/common/filters/uniquie-constraint.filter';
import { Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserSwaggerDecorator } from './swagger/controller/createUserSwagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger('userController');
  constructor(private readonly userService: UserService) {}

  @CreateUserSwaggerDecorator()
  @UseFilters(UniqueConstraintFilter)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Create user controller');
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
