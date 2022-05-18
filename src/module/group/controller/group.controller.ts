import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { UpdateGroupRequest } from '@/module/group/dto/request/update-group.request';
import { GroupMemberResponse } from '@/module/group/group-member/dto/response/group-member.response';

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

  @Get('/join/list')
  @ApiOperation({
    summary: 'JoinedGroup',
    description: '참여한 그룹 목록을 가져올 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: [GroupResponse] })
  async joinedGroup(
    @AuthUser() { memberId }: AuthUserResponse,
  ): Promise<GroupResponse[]> {
    return this.groupFacade.getJoinedGroup(memberId);
  }

  @Get('/:groupId/member/list')
  @ApiOperation({
    summary: 'GroupMemberList',
    description: '그룹의 참여자 목록을 가져올 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: [GroupMemberResponse] })
  async groupMemberList(
    @Param('groupId') groupId: string,
    @AuthUser() { memberId }: AuthUserResponse,
  ): Promise<GroupMemberResponse[]> {
    return this.groupFacade.getGroupMember(groupId, memberId);
  }

  @Get('/popular/list')
  @ApiOperation({
    summary: 'PopularGroupList',
    description: '인기 그룹 리스트를 조회할 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: [GroupResponse] })
  async popularGroupList(@Query('limit') limit?: number) {
    return this.groupFacade.getPopularList(limit);
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

  @Patch(':groupId')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'UpdateGroup',
    description: '그룹을 수정할 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: GroupResponse })
  @ApiImplicitFile({ name: 'image' })
  @UseInterceptors(FileInterceptor('image'))
  async updateGroup(
    @Param('groupId') groupId: string,
    @AuthUser() { memberId }: AuthUserResponse,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateGroupRequest: UpdateGroupRequest,
  ): Promise<GroupResponse> {
    return this.groupFacade.update(
      groupId,
      memberId,
      updateGroupRequest,
      image,
    );
  }

  @Delete('/:groupId')
  @ApiOperation({
    summary: 'DeleteGroup',
    description: '그룹을 삭제할 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: Boolean })
  async groupDelete(
    @Param('groupId') groupId: string,
    @AuthUser() { memberId }: AuthUserResponse,
  ): Promise<boolean> {
    return this.groupFacade.delete(groupId, memberId);
  }

  @Post('/join/:groupId')
  @ApiOperation({
    summary: 'JoinGroup',
    description: '그룹에 참여할 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: Boolean })
  async joinGroup(
    @Param('groupId') groupId: string,
    @AuthUser() { memberId }: AuthUserResponse,
  ): Promise<boolean> {
    return this.groupFacade.join(groupId, memberId);
  }

  @Delete('/cancel/:groupId')
  @ApiOperation({
    summary: 'CancelGroup',
    description: '그룹 참여를 취소할 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: Boolean })
  async cancelGroup(
    @Param('groupId') groupId: string,
    @AuthUser() { memberId }: AuthUserResponse,
  ): Promise<boolean> {
    return this.groupFacade.cancel(groupId, memberId);
  }

  @Patch('/accept/:groupId')
  @ApiOperation({
    summary: 'AcceptGroupMember',
    description: '그룹 참여 신청을 수락할 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: Boolean })
  async acceptGroupMember(
    @Param('groupId') groupId: string,
    @AuthUser() { memberId: managerId }: AuthUserResponse,
    @Body() { memberId }: { memberId: string },
  ): Promise<boolean> {
    return this.groupFacade.accept(groupId, managerId, memberId);
  }

  @Patch('/reject/:groupId')
  @ApiOperation({
    summary: 'RejectGroupMember',
    description: '그룹 참여 신청을 거절할 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: Boolean })
  async rejectGroupMember(
    @Param('groupId') groupId: string,
    @AuthUser() { memberId: managerId }: AuthUserResponse,
    @Body() { memberId }: { memberId: string },
  ): Promise<boolean> {
    return this.groupFacade.reject(groupId, managerId, memberId);
  }
}
