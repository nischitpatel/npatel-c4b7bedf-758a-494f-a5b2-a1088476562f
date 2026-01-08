import { TaskCategory } from '../enums/task-category.enum';

export interface CreateTaskDto {
  title: string;
  description?: string;
  category: TaskCategory;
}
