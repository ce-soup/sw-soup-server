import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUserResponse, IAuthUserResponse } from '@/module/auth/dto/response/AuthUserResponse';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): IAuthUserResponse => {
  const request = ctx.switchToHttp().getRequest();
  return {
    memberId: undefined,
    roles: undefined,
    ...JSON.parse(request.header('authorization')),
  } as AuthUserResponse;
});
