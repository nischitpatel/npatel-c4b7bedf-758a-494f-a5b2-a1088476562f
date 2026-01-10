import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
// import { AuthController } from './auth/auth.controller';
// import { AuthService } from './auth/auth.service';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from '../../../../libs/auth/src/guards/jwt-auth.guard';
// import { RbacGuard } from '../../../../libs/auth/src/guards/rbac.guard';
import { MeModule } from './me/me.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [AuthModule, MeModule, TasksModule],
  controllers: [AppController], //, AuthController
  providers: [AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RbacGuard,
    // },
  ], //[AppService, AuthService],
})
export class AppModule {}
