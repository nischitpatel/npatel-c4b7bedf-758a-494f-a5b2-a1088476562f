// import { Controller, Get } from '@nestjs/common';

// @Controller('auth')
// export class AuthController {
  
//   @Get('ping')
//   getPing() {
//     return { message: 'Auth module is working!' };
//   }
// }
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('ping')
  getPing() {
    return { message: 'Auth module is working!' };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      body.email,
      body.password
    );
    return this.authService.login(user);
  }
}
