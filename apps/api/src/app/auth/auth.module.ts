import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
// import { UsersService } from './users.service';
// import { UsersService } from './auth.service';
import { UsersModule } from '../entities/users/users.module';

@Module({
    imports: [
      UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY', // move to env in production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy], //, UsersService
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
