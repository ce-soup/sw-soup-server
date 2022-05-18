import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Group } from '@/module/group/entities/group.entity';
import { CreateGroupRequest } from '@/module/group/dto/request/create-group.request';
import { UpdateGroupRequest } from '@/module/group/dto/request/update-group.request';
import { FilterGroupRequest } from '@/module/group/dto/request/filter-group.request';
import { GroupScopeEnum } from '../entities/types';
import { OrderGroupRequest } from '@/module/group/dto/request/order-group.request';
import { orderFiled } from '@/module/group/order-group-query.decorator';

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

  async getByGroupType(
    { order }: OrderGroupRequest,
    {
      groupType,
      minPersonnel,
      maxPersonnel,
      isOnline,
      status,
    }: FilterGroupRequest,
  ): Promise<Group[]> {
    try {
      const query = await this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.image', 'image')
        .leftJoinAndSelect('group.category', 'category')
        .leftJoinAndSelect('group.manager', 'manager')
        .where('group.scope IN (scope)', {
          scope: [GroupScopeEnum.Public, GroupScopeEnum.Member],
        });

      if (order) query.orderBy(`group.${orderFiled[order]}`, 'DESC');

      if (groupType) query.andWhere('group.type = :groupType', { groupType });
      if (minPersonnel)
        query.andWhere('group.personnel >= :minPersonnel', { minPersonnel });
      if (maxPersonnel)
        query.andWhere('group.personnel <= :maxPersonnel', { maxPersonnel });
      if (isOnline) query.andWhere('group.isOnline = :isOnline', { isOnline });
      if (status) query.andWhere('group.status = :status', { status });

      return query.getMany();
    } catch (e) {
      console.group(`[GroupService.getByGroupType]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async getPopularGroup(limit?: number): Promise<Group[]> {
    try {
      const query = await this.groupRepository.createQueryBuilder('group');
      query
        .orderBy('views', 'DESC')
        .leftJoinAndSelect('group.image', 'image')
        .leftJoinAndSelect('group.category', 'category')
        .leftJoinAndSelect('group.manager', 'manager');
      if (limit) query.limit(limit);
      return query.getMany();
    } catch (e) {
      console.group(`[GroupService.getPopularGroup]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async increaseViewCount(groupId: string): Promise<boolean> {
    try {
      const group = await this.getById(groupId);
      group.views += 1;
      await this.groupRepository.save(group);
      return true;
    } catch (e) {
      console.group(`[GroupService.increaseViewCount]`);
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
      const group = await this.getById(groupId);

      if (request.name) group.name = request.name;
      if (request.categoryId) group.categoryId = request.categoryId;
      if (request.personnel) group.personnel = request.personnel;
      if (request.isOnline) group.isOnline = request.isOnline;
      if (request.scope) group.scope = request.scope;
      if (request.startDate) group.startDate = request.startDate;
      if (request.endDate) group.endDate = request.endDate;
      if (request.startHour) group.startHour = request.startHour;
      if (request.startMinute) group.startMinute = request.startMinute;
      if (request.endHour) group.endHour = request.endHour;
      if (request.endMinute) group.endMinute = request.endMinute;
      if (request.dayOfTheWeek)
        group.dayOfTheWeek =
          typeof request.dayOfTheWeek === 'string'
            ? JSON.parse(request.dayOfTheWeek)
            : request.dayOfTheWeek;
      if (request.meetingLink) group.meetingLink = request.meetingLink;
      if (imageId) group.imageId = imageId;

      await this.groupRepository.save(group);

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

  async delete(groupId: string): Promise<boolean> {
    try {
      await this.groupRepository.delete(groupId);

      return true;
    } catch (e) {
      console.group(`[GroupService.delete]`);
      console.log(e);
      console.groupEnd();
    }
  }
}
