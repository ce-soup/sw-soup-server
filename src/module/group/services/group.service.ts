import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Group } from '@/module/group/entities/group.entity';
import { CreateGroupRequest } from '@/module/group/dto/request/create-group.request';
import { GroupScopeEnum, GroupTypeEnum } from '@/module/group/entities/types';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async getById(id: string): Promise<Group> {
    try {
      return this.groupRepository.findOne({
        where: { id },
        relations: ['image', 'category', 'manager'],
      });
    } catch (e) {
      console.group(`[GroupService.getByGroupType]`);
      console.log(e);
      console.groupEnd();
    }
  }

  /**
   * Todo: scope가 member일 경우에 대한 필터링 필요 && 검색 필터링 관련 옵션 필요
   * */
  async getByGroupType(groupType: GroupTypeEnum): Promise<Group[]> {
    try {
      return this.groupRepository.find({
        where: {
          type: groupType,
          scope: In([GroupScopeEnum.Public, GroupScopeEnum.Member]),
        },
        relations: ['image', 'category', 'manager'],
      });
    } catch (e) {
      console.group(`[GroupService.getByGroupType]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async create(
    managerId: string,
    { image, ...request }: CreateGroupRequest,
    imageId: string,
  ): Promise<Group> {
    try {
      const group = await this.groupRepository.save(
        Group.of({ ...request, managerId, imageId }),
      );

      return this.groupRepository.findOne({
        where: { id: group.id },
        relations: ['image', 'category', 'manager'],
      });
    } catch (e) {
      console.group(`[GroupService.create]`);
      console.log(e);
      console.groupEnd();
    }
  }
}
