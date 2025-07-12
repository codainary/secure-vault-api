import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

// import { VaultModule } from './vault/vault.module';
// import { CryptoModule } from './crypto/crypto.module';
// import { AuditModule } from './audit/audit.module';
// import { NotificationModule } from './notification/notification.module';
// import { AuthModule } from './auth/auth.module';
// import { VaultModule } from './vault/vault.module';
// import { AuthModule } from './auth/auth.module';
// import { NotificationModule } from './notification/notification.module';
// import { AuditModule } from './audit/audit.module';
// import { CryptoModule } from './crypto/crypto.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import configuration from './config/configuration';
import { validationSchema } from './config/env.validation'
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      load: [configuration],
      validationSchema,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: config.get<number>('throttler.ttl') ?? 60,
            limit: config.get<number>('throttler.limit') ?? 10,
          },
        ],
      }),
    }),
    // ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    // VaultModule,
    // CryptoModule,
    // AuthModule,
    // NotificationModule,
    // AuditModule,
    LoggerModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
