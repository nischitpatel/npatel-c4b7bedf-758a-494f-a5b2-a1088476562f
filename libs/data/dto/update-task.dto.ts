import { TaskStatus } from '../enums/task-status.enum';
import { TaskCategory } from '../enums/task-category.enum';

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  category?: TaskCategory;
}
