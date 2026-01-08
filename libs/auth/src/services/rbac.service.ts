import { Role } from '../enums/role.enum';
import { Permission } from '../enums/permission.enum';

export class RbacService {
  private static readonly rolePermissions: Record<Role, Permission[]> = {
    [Role.OWNER]: [
      Permission.TASK_CREATE,
      Permission.TASK_READ,
      Permission.TASK_UPDATE,
      Permission.TASK_DELETE,
      Permission.AUDIT_READ,
    ],
    [Role.ADMIN]: [
      Permission.TASK_CREATE,
      Permission.TASK_READ,
      Permission.TASK_UPDATE,
      Permission.TASK_DELETE,
    ],
    [Role.VIEWER]: [
      Permission.TASK_READ,
    ],
  };

  static getPermissionsForRole(role: Role): Permission[] {
    return this.rolePermissions[role] ?? [];
  }

  static hasPermission(role: Role, permission: Permission): boolean {
    return this.getPermissionsForRole(role).includes(permission);
  }
}
