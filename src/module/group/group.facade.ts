import { Injectable } from '@nestjs/common';

import { GroupService } from '@/module/group/services/group.service';
import { CreateGroupRequest } from '@/module/group/dto/request/create-group.request';
import { GroupResponse } from '@/module/group/dto/response/group.response';
import { Express } from 'express';
import { FileFacade } from '@/module/file/file.facade';
import { FileTypes } from '@/module/file/file.contants';
import { GroupTypeEnum } from '@/module/group/entities/types';
import { GroupNotFoundException } from '@/module/group/exceptions/group-not-found.exception';
import { UpdateGroupRequest } from '@/module/group/dto/request/update-group.request';
import { UpdatePermissionException } from '@/module/group/exceptions/update-permission.exception';

@Injectable()
export class GroupFacade {
  constructor(
    private readonly groupService: GroupService,
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
}
