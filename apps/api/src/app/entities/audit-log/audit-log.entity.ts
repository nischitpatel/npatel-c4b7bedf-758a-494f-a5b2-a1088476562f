import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { Organization } from '../organizations/organization.entity';

export enum AuditAction {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
}

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  /** Actor */
  @ManyToOne(() => User, (user) => user.auditLogs, { nullable: false })
  user: User;

  /** Task being acted on */
  @ManyToOne(() => Task, (task) => task.auditLogs, { nullable: true })
  task?: Task;

  /** Organization scope */
  @ManyToOne(() => Organization, (org) => org.auditLogs, { nullable: false })
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;
}
