import { Injectable } from '@nestjs/common';

import { GroupService } from '@/module/group/services/group.service';
import { CreateGroupRequest } from '@/module/group/dto/request/create-group.request';
import { GroupResponse } from '@/module/group/dto/response/group.response';
import { Express } from 'express';
import { FileFacade } from '@/module/file/file.facade';
import { FileTypes } from '@/module/file/file.contants';
import { GroupTypeEnum } from '@/module/group/entities/types';
import { GroupNotFoundException } from '@/module/group/exceptions/group-not-found.exception';

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
    const file = await this.fileFacade.create(
      FileTypes.Group,
      image,
      managerId,
    );
    const group = await this.groupService.create(managerId, request, file.id);

    return GroupResponse.of(group);
  }
}
