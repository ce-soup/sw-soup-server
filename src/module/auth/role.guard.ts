import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthUserResponse, Role } from '@/module/auth/dto/response/AuthUserResponse';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const required = this.reflector.getAllAndMerge<Role[]>('roles', [context.getHandler(), context.getClass()]);
    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.header('authorization');
    if (!authorization) return false;

    const user: AuthUserResponse = JSON.parse(authorization ?? '{}') as AuthUserResponse;

    return required.every((role) => user.roles.includes(role));
  }
}
