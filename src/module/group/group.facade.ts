import { Injectable } from '@nestjs/common';

import { GroupService } from '@/module/group/services/group.service';
import { CreateGroupRequest } from '@/module/group/dto/request/create-group.request';
import { GroupResponse } from '@/module/group/dto/response/group.response';
import { Express } from 'express';
import { FileFacade } from '@/module/file/file.facade';
import { FileTypes } from '@/module/file/file.contants';
import {
  GroupRecruitmentEnum,
  GroupTypeEnum,
} from '@/module/group/entities/types';
import { GroupNotFoundException } from '@/module/group/exceptions/group-not-found.exception';
import { UpdateGroupRequest } from '@/module/group/dto/request/update-group.request';
import { UpdatePermissionException } from '@/module/group/exceptions/update-permission.exception';
import { GroupMemberService } from '@/module/group/group-member/services/group-member.service';
import { FullOfParticipantsException } from '@/module/group/exceptions/full-of-participants.exception';
import { AlreadyInGroupMemberException } from '@/module/group/exceptions/already-in-group-member.exception';
import { NotJoinGroupMemberException } from '@/module/group/exceptions/not-join-group-member.exception';
import { NotGroupManagerException } from '@/module/group/exceptions/not-group-manager.exception';

@Injectable()
export class GroupFacade {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupMemberService: GroupMemberService,
    private readonly fileFacade: FileFacade,
  ) {}

  async getOne(id: string): Promise<GroupResponse> {
    const group = await this.groupService.getById(id);
    if (!group) {
      throw new GroupNotFoundException();
    }

    return GroupResponse.of(group);
  }

  async getAll(groupType: GroupTypeEnum): Promise<GroupResponse[]> {
    const groupList = await this.groupService.getByGroupType(groupType);

    return groupList.map((group) => GroupResponse.of(group));
  }

  async getJoinedGroup(memberId: string): Promise<GroupResponse[]> {
    const groupListIds = await this.groupMemberService
      .getByMemberId(memberId)
      .then((groupMember) => groupMember.map(({ group }) => group.id));

    const groupList = await this.groupService.getByIds(groupListIds);

    return groupList.map((group) => GroupResponse.of(group));
  }

  async create(
    managerId: string,
    request: CreateGroupRequest,
    image: Express.Multer.File,
  ): Promise<GroupResponse> {
    const file = image
      ? await this.fileFacade.create(FileTypes.Group, image, managerId)
      : null;
    const group = await this.groupService.create(
      managerId,
      request,
      file ? file.id : null,
    );

    return GroupResponse.of(group);
  }

  async update(
    groupId: string,
    memberId: string,
    request: UpdateGroupRequest,
    image: Express.Multer.File,
  ): Promise<GroupResponse> {
    const group = await this.groupService.getById(groupId);
    if (group.managerId !== memberId) {
      throw new UpdatePermissionException();
    }

    const newImage = image
      ? await (async () => {
          await this.fileFacade.delete(group.imageId);
          return await this.fileFacade.create(FileTypes.Group, image, memberId);
        })()
      : null;

    const newGroup = await this.groupService.update(
      groupId,
      request,
      newImage ? newImage.id : null,
    );

    return GroupResponse.of(newGroup);
  }

  async join(groupId: string, memberId: string): Promise<boolean> {
    const group = await this.groupService.getById(groupId);
    if (await this.isGroupMember(groupId, memberId)) {
      throw new AlreadyInGroupMemberException();
    }
    if (
      (await this.groupMemberService
        .getByGroupId(groupId)
        .then((res) => res.length)) >= group.personnel
    ) {
      throw new FullOfParticipantsException();
    }

    await this.groupMemberService.join(
      groupId,
      memberId,
      group.recruitment === GroupRecruitmentEnum.FirstCome,
    );

    return true;
  }

  async cancel(groupId: string, memberId: string): Promise<boolean> {
    if (!(await this.isGroupMember(groupId, memberId))) {
      throw new NotJoinGroupMemberException();
    }

    await this.groupMemberService.cancel(groupId, memberId);

    return true;
  }

  async accept(groupId: string, memberId: string): Promise<boolean> {
    if (!(await this.isGroupManager(groupId, memberId))) {
      throw new NotGroupManagerException();
    }

    return this.groupMemberService.accept(groupId, memberId);
  }

  async reject(groupId: string, memberId: string): Promise<boolean> {
    if (!(await this.isGroupManager(groupId, memberId))) {
      throw new NotGroupManagerException();
    }

    return this.groupMemberService.reject(groupId, memberId);
  }

  private async isGroupMember(
    groupId: string,
    memberId: string,
  ): Promise<boolean> {
    return await this.groupMemberService
      .getByGroupIdAndMemberId(groupId, memberId)
      .then((res) => !!res);
  }

  private async isGroupManager(
    groupId: string,
    memberId: string,
  ): Promise<boolean> {
    const group = await this.groupService.getById(groupId);
    return group.managerId === memberId;
  }
}
