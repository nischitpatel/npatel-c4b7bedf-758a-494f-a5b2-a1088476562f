import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RbacGuard, Permissions } from '@org/auth';
import { Permission } from '@org/auth';
import { AuditService } from '@org/auth';

@Controller('audit-log')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AuditLogController {
  constructor(private readonly auditService: AuditService) {}

  // Only roles with AUDIT_READ permission (Owner/Admin)
  @Get()
  @Permissions(Permission.AUDIT_READ)
  getLogs() {
    const logs = this.auditService.getLogs();
    return logs;
  }
}
