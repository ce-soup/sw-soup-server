import { Controller, Get } from '@nestjs/common';

import { RoleGuard } from '@/module/auth/role-guard.decorator';
import { AuthUser } from '@/module/auth/auth-user.decorators';
import { AuthUserResponse, Role } from '@/module/auth/dto/response/AuthUserResponse';
import { MemberService } from '@/module/member/services/member.service';
import { MemberResponse } from '@/module/member/dto/response/member.response';

@Controller('/api/v1/member')
@RoleGuard([Role.General])
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/me')
  async getMe(@AuthUser() user: AuthUserResponse): Promise<MemberResponse> {
    return this.memberService.findMemberById(user.memberId);
  }
}
