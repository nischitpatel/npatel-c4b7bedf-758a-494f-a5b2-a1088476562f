import { Injectable } from '@nestjs/common';
import { TaskDto } from '@org/data';
import { AuthUser } from '../interfaces/auth-user.interface';

export interface AuditLog {
  userId: string;
  userEmail: string;
  action: string;
  resource: string; // e.g., TASK
  resourceId?: string;
  timestamp: string;
}

@Injectable()
export class AuditService {
  private logs: AuditLog[] = [];

  logTaskAction(user: AuthUser, action: string, task?: TaskDto) {
    const entry: AuditLog = {
      userId: user.id,
      userEmail: user.email,
      action,
      resource: 'TASK',
      resourceId: task?.id,
      timestamp: new Date().toISOString(),
    };
    this.logs.push(entry);
    console.log('[AUDIT]', entry);
  }

  getLogs(): AuditLog[] {
    return this.logs;
  }
}
