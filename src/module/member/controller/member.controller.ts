import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleGuard } from '@/module/auth/role-guard.decorator';
import { AuthUser } from '@/module/auth/auth-user.decorators';
import { AuthUserResponse, Role } from '@/module/auth/dto/response/AuthUserResponse';
import { MemberService } from '@/module/member/services/member.service';

import { FindMemberRequest } from '@/module/member/dto/request/find-member.request';
import { MemberResponse } from '@/module/member/dto/response/member.response';

@ApiTags('MemberController')
@Controller('/api/v1/member')
@RoleGuard([Role.General])
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get(':id')
  @ApiOperation({ summary: 'GetMember', description: '유저의 정보를 가져올 수 있어요.' })
  @ApiOkResponse({ description: 'OK', type: MemberResponse })
  async getMember(@Param('id') request: FindMemberRequest): Promise<MemberResponse> {
    return await this.memberService.findMemberById(request.id);
  }

  @Get('/me')
  @ApiOperation({ summary: 'GetMe', description: '자기 자신에 대한 정보를 가져올 수 있어요.' })
  @ApiOkResponse({ description: 'OK', type: MemberResponse })
  async getMe(@AuthUser() user: AuthUserResponse): Promise<MemberResponse> {
    return await this.memberService.findMemberById(user.memberId);
  }
}
