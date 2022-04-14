import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthUserResponse } from '@/module/auth/dto/response/AuthUserResponse';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const header: AuthUserResponse = {
      memberId: undefined,
      roles: undefined,
      ...JSON.parse(request.header('authorization')),
    } as AuthUserResponse;
    return header?.memberId !== null;
  }
}
