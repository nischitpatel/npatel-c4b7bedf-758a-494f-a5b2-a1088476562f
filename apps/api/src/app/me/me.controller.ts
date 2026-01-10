import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser, Permissions } from '@org/auth';
import { AuthUser } from '@org/auth';
import { Permission } from '@org/auth';
import { JwtAuthGuard } from '@org/auth';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  @Get()
//   @Permissions('READ_SELF')
//   @Permissions(Permission.READ_SELF)
  getProfile(@CurrentUser() user: AuthUser) {
    return user;
  }
}
