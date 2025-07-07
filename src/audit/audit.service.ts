import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AccessResult } from './types/access-result.enum';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaClient) {}

  async logVaultAccess(params: {
    vaultId: string;
    ip: string;
    userAgent: string;
    result: AccessResult;
  }) {
    await this.prisma.vaultAccessLog.create({
      data: {
        vaultId: params.vaultId,
        ip: params.ip,
        userAgent: params.userAgent,
        result: params.result,
      },
    });
  }

  async getLogsForVault(vaultId: string) {
    return this.prisma.vaultAccessLog.findMany({
      where: { vaultId },
      orderBy: { at: 'desc' },
    });
  }
}
