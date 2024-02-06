import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateMessageSwaggerDecorator,
  GetMessagesSwaggerDecorator,
} from './swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from '../user/entities/user.entity';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { UpdateMessageSeen } from './dto/update-message-seen.dto';
import { UpdatMessageSeenSwagger } from './swagger/controller/updateMessageSeenSwagger.decorator';
import { Pagination } from 'src/common/interfaces/totalPagination.interface';
import { MessageDocument } from './entities/message.entity';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @CreateMessageSwaggerDecorator()
  @Auth()
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Auth()
  @Get(':id')
  @GetMessagesSwaggerDecorator()
  findAll(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User,
  ): Promise<Pagination & { messages: MessageDocument[] }> {
    return this.messageService.findAll(user, id, paginationDto);
  }

  @Auth()
  @Patch(':id/updatereaction')
  updateReaction(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @GetUser() user: User,
  ) {
    return this.messageService.updateIconReaction(id, updateMessageDto, user);
  }

  @UpdatMessageSeenSwagger()
  @Auth()
  @Patch(':id/updateseen')
  updateSeenMessageBatch(
    @Body() updateMessageSeen: UpdateMessageSeen,
    //TODO: esto no es 100% correcto porque este id es de un usuario, lo logico es que sea de un mensaje, ya que estamos en el controlador de mensajes
    // quizas habria que pasar ese id en el body
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.messageService.updateSeenMessages(updateMessageSeen, id, user);
  }
}
