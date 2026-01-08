import { TaskDto } from './task.dto';
import { TaskStatus } from '../enums/task-status.enum';

describe('TaskDto', () => {
  it('should allow creating a task object', () => {
    const task: TaskDto = {
      id: '1',
      title: 'Test task',
      status: TaskStatus.PENDING,
      category: 'WORK',
      ownerId: 'user1',
      organizationId: 'org1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(task.title).toBe('Test task');
  });
});
