import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@org/data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users/user.entity';
import { Organization } from '../entities/organizations/organization.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      relations: ['organization'],
    });
  }

  async createUser(
    email: string,
    password: string,
    role: Role,
    organization: Organization,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role,
      organization,
    });

    return this.userRepo.save(user);
  }
}


// export interface User {
//   id: string;
//   email: string;
//   password: string; // hashed
//   role: Role;
//   organizationId: string;
// }

// @Injectable()
// export class UsersService {
//   private users: User[] = [
//     {
//       id: '1',
//       email: 'owner@example.com',
//       password: bcrypt.hashSync('password', 10),
//       role: 'OWNER',
//       organizationId: 'org1',
//     },
//     {
//       id: '2',
//       email: 'admin@example.com',
//       password: bcrypt.hashSync('password', 10),
//       role: 'ADMIN',
//       organizationId: 'org1',
//     },
//   ];

//   async findByEmail(email: string): Promise<User | undefined> {
//     return this.users.find((u) => u.email === email);
//   }
// }

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
      organizationId: user.organization.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
