import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleGuard } from '@/module/auth/role-guard.decorator';
import { AuthUser } from '@/module/auth/auth-user.decorators';
import { AuthUserResponse, Role } from '@/module/auth/dto/response/AuthUserResponse';

import { FindMemberRequest } from '@/module/member/dto/request/find-member.request';
import { UpdateProfileImageRequest } from '@/module/member/dto/request/update-profile-image.request';
import { MemberResponse } from '@/module/member/dto/response/member.response';
import { FileResponse } from '@/module/file/dto/response/file.response';
import { MemberFacade } from '@/module/member/member.facade';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('/profile/image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'UpdateProfileImage', description: '프로필 사진을 업데이트 할 수 있어요.' })
  @ApiOkResponse({ description: 'OK', type: FileResponse })
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @AuthUser() user: AuthUserResponse,
    @UploadedFile() { file }: UpdateProfileImageRequest,
  ): Promise<FileResponse> {
    return this.memberFacade.updateProfileImage(file, user);
  }
}
