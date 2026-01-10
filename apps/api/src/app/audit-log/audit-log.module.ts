import { Module } from '@nestjs/common';
import { AuditLogController } from './audit-log.controller';
import { AuditService } from '@org/auth';

@Module({
  controllers: [AuditLogController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditLogModule {}
