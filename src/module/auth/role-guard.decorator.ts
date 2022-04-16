import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

import { Role } from '@/module/auth/dto/response/AuthUserResponse';
import { Roles } from '@/module/auth/role.decorator';
import { AuthGuard } from '@/module/auth/auth.guard';
import { RoleAuthGuard } from '@/module/auth/role.guard';

export const RoleGuard = (roles: Role[]) =>
  applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard),
    UseGuards(RoleAuthGuard),
    ApiSecurity('Authorization', ['global']),
  );
