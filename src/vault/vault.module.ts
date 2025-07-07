import { Module } from '@nestjs/common';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';
import { PrismaClient } from '@prisma/client';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [CryptoModule],
  controllers: [VaultController],
  providers: [VaultService, PrismaClient],
})
export class VaultModule {}
