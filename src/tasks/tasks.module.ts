import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ImagesModule } from 'src/api/images/images.module';
// import { TasksController } from './tasks.controller';

@Module({
  providers: [TasksService],
  imports: [ImagesModule],
})
export class TasksModule {}
