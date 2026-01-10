import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDto, CreateTaskDto, UpdateTaskDto } from '@org/data';
import { TaskStatus, TaskCategory } from '@org/data';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
    private tasks: TaskDto[] = []; // in-memory store for now

    create(dto: CreateTaskDto, ownerId: string, organizationId: string): TaskDto {
        const task: TaskDto = {
            id: uuidv4(),
            title: dto.title,
            description: dto.description,
            status: TaskStatus.PENDING,
            category: dto.category || TaskCategory.WORK,
            ownerId,
            organizationId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.tasks.push(task);
        return task;
    }

    findAllForUser(userId: string, organizationId: string): TaskDto[] {
        return this.tasks.filter(
            (t) => t.organizationId === organizationId && t.ownerId === userId,
        );
    }

    findOne(id: string): TaskDto {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    findAllForOrganization(organizationId: string): TaskDto[] {
        return this.tasks.filter((t) => t.organizationId === organizationId);
    }


    update(id: string, dto: UpdateTaskDto): TaskDto {
        const task = this.findOne(id);
        Object.assign(task, dto, { updatedAt: new Date().toISOString() });
        return task;
    }

    remove(id: string): void {
        const index = this.tasks.findIndex((t) => t.id === id);
        if (index === -1) throw new NotFoundException('Task not found');
        this.tasks.splice(index, 1);
    }
}
