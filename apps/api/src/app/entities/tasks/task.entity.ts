import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  // Index,
} from 'typeorm';
import { TaskStatus, TaskCategory } from '@org/data';
import { User } from '../users/user.entity';
import { Organization } from '../organizations/organization.entity';

@Entity('tasks')
// @Index(['organizationId'])
// @Index(['ownerId'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: 'varchar',
    default: TaskCategory.WORK,
  })
  category: TaskCategory;

  // RELATION TO USER
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'ownerId' })  
  owner: User;

  // RELATION TO ORGANIZATION
  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn({ name: 'organizationId' }) 
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
