import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskDto } from '@org/data';
import { JwtAuthGuard, RbacGuard, CurrentUser } from '@org/auth';
import { AuthUser } from '@org/auth';
// import { Permission } from '@org/data';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  // @Permissions(Permission.TASK_CREATE)
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthUser): TaskDto {
    return this.tasksService.create(dto, user.id, user.organizationId);
  }

  @Get()
  // @Permissions(Permission.TASK_READ)
  findAll(@CurrentUser() user: AuthUser): TaskDto[] {
    return this.tasksService.findAllForUser(user.id, user.organizationId);
  }

  @Get(':id')
  // @Permissions(Permission.TASK_READ)
  findOne(@Param('id') id: string): TaskDto {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  // @Permissions(Permission.TASK_UPDATE)
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): TaskDto {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  // @Permissions(Permission.TASK_DELETE)
  remove(@Param('id') id: string): void {
    this.tasksService.remove(id);
  }
}
