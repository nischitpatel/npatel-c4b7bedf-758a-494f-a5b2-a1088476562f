import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { TasksModule } from './tasks/tasks.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { UsersModule } from './entities/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { OrganizationsModule } from './entities/organizations/organizations.module';
import { User } from './entities/users/user.entity';
import { Organization } from './entities/organizations/organization.entity';

@Module({
  imports: [AuthModule, MeModule, TasksModule, AuditLogModule, 
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      entities: [User, Organization],
    }),
    UsersModule,
    OrganizationsModule
  ],
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
