import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@org/data';

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  role: Role;
  organizationId: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      email: 'owner@example.com',
      password: bcrypt.hashSync('password', 10),
      role: 'OWNER',
      organizationId: 'org1',
    },
    {
      id: '2',
      email: 'admin@example.com',
      password: bcrypt.hashSync('password', 10),
      role: 'ADMIN',
      organizationId: 'org1',
    },
  ];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }
}
