import { TaskStatus } from '../enums/task-status.enum';
import { TaskCategory } from '../enums/task-category.enum';

export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category: TaskCategory;
  ownerId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
