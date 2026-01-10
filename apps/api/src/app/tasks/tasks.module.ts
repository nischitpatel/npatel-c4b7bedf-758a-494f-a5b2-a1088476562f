import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuditService } from '@org/auth';

@Module({
  controllers: [TasksController],
  providers: [TasksService, AuditService],  
})
export class TasksModule {}
