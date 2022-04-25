import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleGuard } from '@/module/auth/role-guard.decorator';
import { AuthUser } from '@/module/auth/auth-user.decorators';
import { AuthUserResponse, Role } from '@/module/auth/dto/response/AuthUserResponse';

import { FindMemberRequest } from '@/module/member/dto/request/find-member.request';
import { MemberResponse } from '@/module/member/dto/response/member.response';
import { MemberFacade } from '@/module/member/member.facade';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileRequest } from '@/module/member/dto/request/update-profile.request';
import { Express } from 'express';

@ApiTags('MemberController')
@Controller('/api/v1/member')
@RoleGuard([Role.General])
export class MemberController {
  constructor(private readonly memberFacade: MemberFacade) {}

  @Get('/profile/:id')
  @ApiOperation({ summary: 'GetMember', description: '유저의 정보를 가져올 수 있어요.' })
  @ApiOkResponse({ description: 'OK', type: MemberResponse })
  async getMember(@Param('id') memberId: string): Promise<MemberResponse> {
    return this.memberFacade.findMemberById(FindMemberRequest.of({ id: memberId }));
  }

  @Get('/me')
  @ApiOperation({ summary: 'GetMe', description: '자기 자신에 대한 정보를 가져올 수 있어요.' })
  @ApiOkResponse({ description: 'OK', type: MemberResponse })
  async getMe(@AuthUser() user: AuthUserResponse): Promise<MemberResponse> {
    return this.memberFacade.getMe(user);
  }

  @Post('/profile')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
        },
        bio: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({ summary: 'UpdateProfile', description: '프로필을 업데이트 할 수 있어요.' })
  @ApiOkResponse({ description: 'OK', type: MemberResponse })
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateProfile(
    @AuthUser() user: AuthUserResponse,
    @UploadedFile() profileImage: Express.Multer.File,
    @Body() updateProfileRequest: UpdateProfileRequest,
  ): Promise<MemberResponse> {
    return this.memberFacade.updateProfile(user, updateProfileRequest, profileImage);
  }
}
