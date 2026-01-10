// import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
// import { TasksService } from './tasks.service';
// import { CreateTaskDto, UpdateTaskDto, TaskDto } from '@org/data';
// import { JwtAuthGuard, RbacGuard, CurrentUser } from '@org/auth';
// import { AuthUser } from '@org/auth';
// // import { Permission } from '../data/enums/permission.enum';
// import { Permissions } from '@org/auth';
// import { Permission } from '@org/auth';
// import { AuditService } from '@org/auth';

// @Controller('tasks')
// @UseGuards(JwtAuthGuard, RbacGuard)
// export class TasksController {
//   constructor(
//     private readonly tasksService: TasksService,
//     private readonly auditService: AuditService,
// ) {}

//   @Post()
//   @Permissions(Permission.TASK_CREATE)
//   create(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthUser): TaskDto {
//     const task = this.tasksService.create(dto, user.id, user.organizationId);
//     this.auditService.logTaskAction(user, 'CREATE', task);
//     // return this.tasksService.create(dto, user.id, user.organizationId);
//     return task;
//   }

//   @Get()
//   @Permissions(Permission.TASK_READ)
//   findAll(@CurrentUser() user: AuthUser): TaskDto[] {
//     // Owner/Admin see all org tasks
//     if (user.role === 'OWNER' || user.role === 'ADMIN') {
//       return this.tasksService.findAllForOrganization(user.organizationId);
//     }

//     // Viewer sees only own tasks
//     return this.tasksService.findAllForUser(user.id, user.organizationId);
//   }

//   @Get(':id')
//   @Permissions(Permission.TASK_READ)
//   findOne(@Param('id') id: string, @CurrentUser() user: AuthUser): TaskDto {
//     const task = this.tasksService.findOne(id);

//     // Owner/Admin see all tasks in org
//     if (user.role === 'OWNER' || (user.role === 'ADMIN' && task.organizationId === user.organizationId)) {
//       return task;
//     }

//     // Viewer can see only own tasks
//     if (user.role === 'VIEWER' && task.ownerId === user.id) {
//       return task;
//     }

//     throw new ForbiddenException('You do not have access to this task');
//   }

//   @Put(':id')
//   @Permissions(Permission.TASK_UPDATE)
//   update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: AuthUser): TaskDto {
//     const task = this.tasksService.findOne(id);

//     // Owner can update any task
//     if (user.role === 'OWNER') return this.tasksService.update(id, dto);

//     // Admin can update tasks in their org
//     if (user.role === 'ADMIN' && task.organizationId === user.organizationId) {
//       return this.tasksService.update(id, dto);
//     }

//     throw new ForbiddenException('You do not have permission to update this task');
//   }

//   @Delete(':id')
//   @Permissions(Permission.TASK_DELETE)
//   remove(@Param('id') id: string, @CurrentUser() user: AuthUser): void {
//     const task = this.tasksService.findOne(id);

//     // Owner can delete any task
//     if (user.role === 'OWNER') return this.tasksService.remove(id);

//     // Admin can delete tasks in their org
//     if (user.role === 'ADMIN' && task.organizationId === user.organizationId) {
//       return this.tasksService.remove(id);
//     }

//     throw new ForbiddenException('You do not have permission to delete this task');
//   }
// }
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskDto } from '@org/data';
import { JwtAuthGuard, RbacGuard, CurrentUser } from '@org/auth';
import { AuthUser } from '@org/auth';
import { Permissions, Permission, AuditService } from '@org/auth';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @Permissions(Permission.TASK_CREATE)
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthUser): TaskDto {
    console.log(`[TASK CREATE] User: ${user.email}, Role: ${user.role}, Payload:`, dto);
    const task = this.tasksService.create(dto, user.id, user.organizationId);
    this.auditService.logTaskAction(user, 'CREATE', task);
    console.log('[AUDIT LOGGED] Task created:', task);
    return task;
  }

  @Get()
  @Permissions(Permission.TASK_READ)
  findAll(@CurrentUser() user: AuthUser): TaskDto[] {
    console.log(`[TASK READ ALL] User: ${user.email}, Role: ${user.role}`);
    let tasks: TaskDto[];
    if (user.role === 'OWNER' || user.role === 'ADMIN') {
      tasks = this.tasksService.findAllForOrganization(user.organizationId);
    } else {
      tasks = this.tasksService.findAllForUser(user.id, user.organizationId);
    }
    this.auditService.logTaskAction(user, 'READ_ALL');
    console.log('[AUDIT LOGGED] Tasks fetched:', tasks.length);
    return tasks;
  }

  @Get(':id')
  @Permissions(Permission.TASK_READ)
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser): TaskDto {
    console.log(`[TASK READ] User: ${user.email}, Role: ${user.role}, Task ID: ${id}`);
    const task = this.tasksService.findOne(id);

    if (user.role === 'OWNER' || (user.role === 'ADMIN' && task.organizationId === user.organizationId)) {
      this.auditService.logTaskAction(user, 'READ', task);
      console.log('[AUDIT LOGGED] Task accessed:', task.id);
      return task;
    }

    if (user.role === 'VIEWER' && task.ownerId === user.id) {
      this.auditService.logTaskAction(user, 'READ', task);
      console.log('[AUDIT LOGGED] Task accessed:', task.id);
      return task;
    }

    console.log(`[FORBIDDEN] User: ${user.email} tried to access Task ID: ${task.id}`);
    throw new ForbiddenException('You do not have access to this task');
  }

  @Put(':id')
  @Permissions(Permission.TASK_UPDATE)
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: AuthUser): TaskDto {
    console.log(`[TASK UPDATE] User: ${user.email}, Role: ${user.role}, Task ID: ${id}, Payload:`, dto);
    const task = this.tasksService.findOne(id);

    if (user.role === 'OWNER') {
      const updated = this.tasksService.update(id, dto);
      this.auditService.logTaskAction(user, 'UPDATE', updated);
      console.log('[AUDIT LOGGED] Task updated:', updated.id);
      return updated;
    }

    if (user.role === 'ADMIN' && task.organizationId === user.organizationId) {
      const updated = this.tasksService.update(id, dto);
      this.auditService.logTaskAction(user, 'UPDATE', updated);
      console.log('[AUDIT LOGGED] Task updated:', updated.id);
      return updated;
    }

    console.log(`[FORBIDDEN] User: ${user.email} tried to update Task ID: ${task.id}`);
    throw new ForbiddenException('You do not have permission to update this task');
  }

  @Delete(':id')
  @Permissions(Permission.TASK_DELETE)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser): void {
    console.log(`[TASK DELETE] User: ${user.email}, Role: ${user.role}, Task ID: ${id}`);
    const task = this.tasksService.findOne(id);

    if (user.role === 'OWNER') {
      this.tasksService.remove(id);
      this.auditService.logTaskAction(user, 'DELETE', task);
      console.log('[AUDIT LOGGED] Task deleted:', task.id);
      return;
    }

    if (user.role === 'ADMIN' && task.organizationId === user.organizationId) {
      this.tasksService.remove(id);
      this.auditService.logTaskAction(user, 'DELETE', task);
      console.log('[AUDIT LOGGED] Task deleted:', task.id);
      return;
    }

    console.log(`[FORBIDDEN] User: ${user.email} tried to delete Task ID: ${task.id}`);
    throw new ForbiddenException('You do not have permission to delete this task');
  }
}
