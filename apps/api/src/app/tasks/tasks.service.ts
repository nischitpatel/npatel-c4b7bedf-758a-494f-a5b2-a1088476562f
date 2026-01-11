import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/tasks/task.entity';
import { CreateTaskDto, UpdateTaskDto } from '@org/data';
import { TaskStatus } from '@org/data';
import { User } from '../entities/users/user.entity';
import { Organization } from '../entities/organizations/organization.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(
  dto: CreateTaskDto,
  owner: User,
  organization: Organization,
): Promise<Task> {
  const task = this.taskRepo.create({
    ...dto,
    status: TaskStatus.PENDING,
    owner,
    organization,
  });

  return this.taskRepo.save(task);
}


  async findAllForUser(userId: string, organizationId: string): Promise<Task[]> {
    return this.taskRepo.find({
      // where: { ownerId: userId, organizationId },
      where: { 
        owner: { id: userId }, 
        organization: { id: organizationId } 
      },
      relations: ['owner', 'organization'],
    });
  }

  async findAllForOrganization(organizationId: string): Promise<Task[]> {
    return this.taskRepo.find({
      // where: { organizationId },
      where: { organization: { id: organizationId } },
      relations: ['owner', 'organization'],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({ 
      where: { id },
      relations: ['owner', 'organization'],
     });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
