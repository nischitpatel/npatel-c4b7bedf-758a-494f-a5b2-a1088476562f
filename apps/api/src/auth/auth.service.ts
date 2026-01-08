import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService, User } from './users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
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
