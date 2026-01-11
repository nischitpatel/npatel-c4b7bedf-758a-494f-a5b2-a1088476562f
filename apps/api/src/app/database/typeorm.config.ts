import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/users/user.entity';
import { Organization } from '../entities/organizations/organization.entity';
import { Task } from '../entities/tasks/task.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Organization, Task],
  synchronize: true,
};
