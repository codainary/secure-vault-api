import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaClient],
  exports: [AuthService],
})
export class AuthModule {}