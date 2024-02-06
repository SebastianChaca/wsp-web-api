import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { LoggerModule } from 'nestjs-pino';
import { FriendModule } from './api/friend/friend.module';
import { MessageModule } from './api/message/message.module';
import { SeedModule } from './api/seed/seed.module';
import {
  configuration,
  emailSenderConfiguration,
  gmailConfiguration,
} from '../config/configuration';
import { validationSchema } from 'config/validation';
import { SendEmailModule } from './api/send-email/send-email.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/config/.env.${process.env.NODE_ENV}`,
      load: [configuration, emailSenderConfiguration, gmailConfiguration],
      validationSchema: validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGO_DB'),
        };
      },
    }),
    UserModule,
    AuthModule,
    CommonModule,
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    FriendModule,
    MessageModule,
    SeedModule,
    SendEmailModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
