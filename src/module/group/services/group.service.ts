import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Group } from '@/module/group/entities/group.entity';
import { CreateGroupRequest } from '@/module/group/dto/request/create-group.request';
import { GroupScopeEnum, GroupTypeEnum } from '@/module/group/entities/types';
import { UpdateGroupRequest } from '@/module/group/dto/request/update-group.request';

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

  async getByIds(ids: string[]): Promise<Group[]> {
    try {
      return this.groupRepository.find({
        where: { id: In(ids) },
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

  async update(
    groupId: string,
    { image, ...request }: UpdateGroupRequest,
    imageId?: string,
  ): Promise<Group> {
    try {
      const query = this.groupRepository.createQueryBuilder('group').update(
        await this.groupRepository.findOne({
          where: { id: groupId },
          relations: ['image', 'category', 'manager'],
        }),
      );

      console.log(request);

      if (request.name) query.set({ name: request.name });
      if (request.categoryId) query.set({ categoryId: request.categoryId });
      if (request.personnel) query.set({ personnel: request.personnel });
      if (request.isOnline) query.set({ isOnline: request.isOnline });
      if (request.scope) query.set({ scope: request.scope });
      if (request.startDate) query.set({ startDate: request.startDate });
      if (request.endDate) query.set({ endDate: request.endDate });
      if (request.startHour) query.set({ startHour: request.startHour });
      if (request.startMinute) query.set({ startMinute: request.startMinute });
      if (request.endHour) query.set({ endHour: request.endHour });
      if (request.endMinute) query.set({ endMinute: request.endMinute });
      if (request.dayOfTheWeek)
        query.set({
          dayOfTheWeek:
            typeof request.dayOfTheWeek === 'string'
              ? JSON.parse(request.dayOfTheWeek)
              : request.dayOfTheWeek,
        });
      if (request.meetingLink) query.set({ meetingLink: request.meetingLink });
      if (imageId) query.set({ imageId });

      await query.execute();

      return this.groupRepository.findOne({
        where: { id: groupId },
        relations: ['image', 'category', 'manager'],
      });
    } catch (e) {
      console.group(`[GroupService.update]`);
      console.log(e);
      console.groupEnd();
    }
  }
}
