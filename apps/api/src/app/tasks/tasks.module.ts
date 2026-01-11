import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuditService } from '@org/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [TasksController],
  providers: [TasksService, AuditService],  
})
export class TasksModule {}
