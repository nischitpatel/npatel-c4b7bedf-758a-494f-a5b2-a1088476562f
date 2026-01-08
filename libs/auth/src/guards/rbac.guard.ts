import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/roles.decorator';
  import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
  import { RbacService } from '../services/rbac.service';
  import { AuthUser } from '../interfaces/auth-user.interface';
  import { Permission } from '../enums/permission.enum';
  import { Role } from '../enums/role.enum';
  
  @Injectable()
  export class RbacGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles =
        this.reflector.getAllAndOverride<Role[]>(
          ROLES_KEY,
          [context.getHandler(), context.getClass()],
        );
  
      const requiredPermissions =
        this.reflector.getAllAndOverride<Permission[]>(
          PERMISSIONS_KEY,
          [context.getHandler(), context.getClass()],
        );
  
      const request = context.switchToHttp().getRequest();
      const user = request.user as AuthUser;
  
      if (!user) return false;
  
      if (requiredRoles?.length) {
        return requiredRoles.includes(user.role);
      }
  
      if (requiredPermissions?.length) {
        return requiredPermissions.every((permission) =>
          RbacService.hasPermission(user.role, permission),
        );
      }
  
      return true;
    }
  }
  