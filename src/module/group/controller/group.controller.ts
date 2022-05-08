import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

import { RoleGuard } from '@/module/auth/role-guard.decorator';
import {
  AuthUserResponse,
  Role,
} from '@/module/auth/dto/response/AuthUserResponse';
import { AuthUser } from '@/module/auth/auth-user.decorators';

import { GroupResponse } from '@/module/group/dto/response/group.response';
import { GroupFacade } from '@/module/group/group.facade';
import { CreateGroupRequest } from '@/module/group/dto/request/create-group.request';
import { GroupTypeEnum } from '@/module/group/entities/types';

@ApiTags('GroupController')
@Controller('/api/v1/group')
@RoleGuard([Role.General])
export class GroupController {
  constructor(private readonly groupFacade: GroupFacade) {}

  @Get('/:id')
  @ApiOperation({
    summary: 'GetGroup',
    description: '그룹 정보를 가져올 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: GroupResponse })
  async getGroup(@Param('id') id: string): Promise<GroupResponse> {
    return this.groupFacade.getOne(id);
  }

  @Get('/list/:type')
  @ApiOperation({
    summary: 'GetGroups',
    description: '그룹 목록을 가져올 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: [GroupResponse] })
  async getGroups(
    @Param('type') groupType: GroupTypeEnum,
  ): Promise<GroupResponse[]> {
    return this.groupFacade.getAll(groupType);
  }

  @Post('/new')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'CreateGroup',
    description: '그룹을 생성할 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: GroupResponse })
  @ApiImplicitFile({ name: 'image' })
  @UseInterceptors(FileInterceptor('image'))
  async createGroup(
    @AuthUser() { memberId }: AuthUserResponse,
    @UploadedFile() image: Express.Multer.File,
    @Body() createGroupRequest: CreateGroupRequest,
  ): Promise<GroupResponse> {
    return this.groupFacade.create(memberId, createGroupRequest, image);
  }
}
