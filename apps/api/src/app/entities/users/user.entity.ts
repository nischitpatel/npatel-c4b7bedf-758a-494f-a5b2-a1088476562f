// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   name: string;
// }

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from '../organizations/organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  // Each user belongs to one organization
  @ManyToOne(() => Organization, (org) => org.users)
  organization: Organization;
}
