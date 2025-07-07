import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [AuditService, PrismaClient],
  exports: [AuditService],
})
export class AuditModule {}
