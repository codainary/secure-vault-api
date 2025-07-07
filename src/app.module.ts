import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { VaultModule } from './vault/vault.module';
import { CryptoModule } from './crypto/crypto.module';
import { VaultModule } from './vault/vault.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { AuditModule } from './audit/audit.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    VaultModule,
    CryptoModule,
    AuthModule,
    NotificationModule,
    AuditModule,
  ],
})
export class AppModule {}
