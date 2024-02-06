import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class UniqueConstraintFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception.code === 11000) {
      response.status(400).json({ message: exception.errmsg });
    } else {
      response.status(500).json({ message: 'Internal error.' });
    }
  }
}
