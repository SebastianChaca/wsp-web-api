import { Body, Controller, Get } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { EmailDto } from 'src/common/dto/email.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('send email')
@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @ApiResponse({
    description:
      'Endpoint to test emails sent to new acounts. Only Works for admin users',
  })
  @Auth(ValidRoles.admin)
  @Get('user/creation')
  userCreationEmail(@Body() emailDto: EmailDto) {
    try {
      this.sendEmailService.userCreationEmail(emailDto);
      return 'email mandado';
    } catch (error) {
      throw error;
    }
  }
}
