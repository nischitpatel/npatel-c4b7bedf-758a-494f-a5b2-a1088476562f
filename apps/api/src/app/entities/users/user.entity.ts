// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { Organization } from '../organizations/organization.entity';

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   name: string;

//   // Each user belongs to one organization
//   @ManyToOne(() => Organization, (org) => org.users)
//   organization: Organization;
// }
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { Role } from '@org/data';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed password

  @Column({
    type: 'simple-enum',
    enum: Role,
    default: Role.VIEWER,
  })
  role: Role;

  @ManyToOne(() => Organization, (org) => org.users, { nullable: false })
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;
}
