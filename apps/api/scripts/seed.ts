import { DataSource } from 'typeorm'; // DataSourceOptions
import { Organization } from '../src/app/entities/organizations/organization.entity';
import { User } from '../src/app/entities/users/user.entity';
import { Task } from '../src/app/entities/tasks/task.entity';
import { Role, TaskStatus, TaskCategory } from '@org/data';
import * as bcrypt from 'bcrypt';
// import { typeOrmConfig } from '../src/app/database/typeorm.config';
import { resolve } from 'path';

async function seedAll() {
    const dbPath = resolve(__dirname, '../../../db.sqlite');
  const dataSource = new DataSource({
    // ...(typeOrmConfig as DataSourceOptions),
    // entities: [Organization, User, Task],
    type: 'sqlite',               
    database: dbPath,             
    synchronize: true,            
    entities: [Organization, User, Task],
  });

  await dataSource.initialize();
  console.log('Database connected for seeding');

  const orgRepo = dataSource.getRepository(Organization);
  const userRepo = dataSource.getRepository(User);
  const taskRepo = dataSource.getRepository(Task);

  // Clear existing data in order: tasks → users → orgs
  await taskRepo.clear();
  await userRepo.clear();
  await orgRepo.clear();

  // Create organizations
  const org1 = await orgRepo.save({ name: 'Organization 1' });
  const org2 = await orgRepo.save({ name: 'Organization 2' });

  // Create users
  const user1 = await userRepo.save({
    email: 'owner@example.com',
    password: await bcrypt.hash('password', 10),
    role: Role.OWNER,
    organization: org1,
  });

  const user2 = await userRepo.save({
    email: 'admin@example.com',
    password: await bcrypt.hash('password', 10),
    role: Role.ADMIN,
    organization: org1,
  });

  const user3 = await userRepo.save({
    email: 'viewer@example.com',
    password: await bcrypt.hash('password', 10),
    role: Role.VIEWER,
    organization: org2,
  });

  // Create tasks — make sure owner and organization are linked
  await taskRepo.save([
    {
      title: 'Setup project repo',
      description: 'Initialize Git repo and setup project structure',
      status: TaskStatus.PENDING,
      category: TaskCategory.WORK,
      owner: user1,       // ← must not be null
      organization: org1, // ← must not be null
    },
    {
      title: 'Write API docs',
      description: 'Document all endpoints in Swagger',
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.WORK,
      owner: user2,
      organization: org1,
    },
    {
      title: 'Create onboarding guide',
      description: 'Guide for new employees',
      status: TaskStatus.DONE,
      category: TaskCategory.PERSONAL,
      owner: user3,
      organization: org2,
    },
  ]);

  console.log('Seeding completed!');
  await dataSource.destroy();
}

seedAll().catch((err) => {
  console.error('Seeding error:', err);
});
