import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { googleGmailTransporter } from './utils/googleGmailTransporter';
import { DEVELOPMENT, NODE_ENV } from 'src/common/constants/envvars';
@Module({
  controllers: [SendEmailController],
  providers: [SendEmailService],
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (configService.get(NODE_ENV) === DEVELOPMENT) {
          return {
            transport: {
              host: 'smtp.freesmtpservers.com',
              port: 25,
            },
          };
        }
        return {
          transport: await googleGmailTransporter(configService),
        };
      },
    }),
  ],
})
export class SendEmailModule {}
