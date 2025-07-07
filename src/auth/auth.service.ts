import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaClient, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role, mfa: false };
    return {
      access_token: this.jwt.sign(payload),
    };
  }

  async enableMfa(userId: string) {
    const secret = speakeasy.generateSecret();
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret.base32 },
    });
    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
    };
  }

  async verifyMfa(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const valid = speakeasy.totp.verify({
      secret: user.mfaSecret!,
      encoding: 'base32',
      token,
    });
    if (!valid) throw new UnauthorizedException('Código inválido');

    const payload = { sub: user.id, email: user.email, role: user.role, mfa: true };
    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
