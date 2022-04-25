import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthUserResponse } from '@/module/auth/dto/response/AuthUserResponse';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.header('authorization');
    if (!authorization) return false;

    const header: AuthUserResponse = JSON.parse(authorization) as AuthUserResponse;

    return !!header?.memberId && header?.memberId?.length > 0;
  }
}
