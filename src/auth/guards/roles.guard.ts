import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const { user } = ctx.switchToHttp().getRequest();
    return requiredRoles ? requiredRoles.includes(user.role) : true;
  }
}
