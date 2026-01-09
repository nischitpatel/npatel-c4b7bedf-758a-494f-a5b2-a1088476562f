import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
// import { UsersService, User } from './users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// import { UsersService, User } from './users.service';

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

@Injectable()
export class AuthService {
    constructor(
    @Inject(UsersService) private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
