import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class UniqueConstraintFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception.code === 11000) {
      const message = exception.keyValue.hasOwnProperty('email')
        ? 'Email already exists'
        : exception.errmsg;
      response.status(400).json({ message });
    } else {
      response.status(500).json({ message: 'Internal error.' });
    }
  }
}
