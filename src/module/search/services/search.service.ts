import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group } from '@/module/group/entities/group.entity';
import { Member } from '@/module/member/entities/member.entity';
import { SearchType } from '@/module/search/dto/types';
import { GroupScopeEnum } from '@/module/group/entities/types';
import { FilterGroupRequest } from '@/module/group/dto/request/filter-group.request';
import { OrderGroupRequest } from '@/module/group/dto/request/order-group.request';
import { orderFiled } from '@/module/group/order-group-query.decorator';
import { SearchResponse } from '@/module/search/dto/response/SearchResponse';
import { MemberResponse } from '@/module/member/dto/response/member.response';
import { GroupResponse } from '@/module/group/dto/response/group.response';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async search(
    search: string,
    type: SearchType,
    { order }: OrderGroupRequest,
    {
      groupType,
      minPersonnel,
      maxPersonnel,
      isOnline,
      status,
    }: FilterGroupRequest,
  ): Promise<SearchResponse> {
    try {
      return {
        [SearchType.Group]: async () => {
          const query = await this.groupRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.image', 'image')
            .leftJoinAndSelect('group.category', 'category')
            .leftJoinAndSelect('group.manager', 'manager')
            .where('group.scope IN (scope)', {
              scope: [GroupScopeEnum.Public, GroupScopeEnum.Member],
            });

          query.andWhere('group.name LIKE :search', {
            search: `%${search.trim()}%`,
          });

          if (order) query.orderBy(`group.${orderFiled[order]}`, 'DESC');

          if (groupType)
            query.andWhere('group.type = :groupType', { groupType });
          if (minPersonnel)
            query.andWhere('group.personnel >= :minPersonnel', {
              minPersonnel,
            });
          if (maxPersonnel)
            query.andWhere('group.personnel <= :maxPersonnel', {
              maxPersonnel,
            });
          if (isOnline)
            query.andWhere('group.isOnline = :isOnline', { isOnline });
          if (status) query.andWhere('group.status = :status', { status });

          const result = await query.getMany();

          return SearchResponse.of({
            group: result.map((res) => GroupResponse.of(res)),
          });
        },
        [SearchType.Member]: async () => {
          const query = await this.memberRepository.createQueryBuilder(
            'member',
          );

          query.andWhere('member.name LIKE :search', { search: `%${search}%` });

          const result = await query.getMany();
          return SearchResponse.of({
            member: result.map((res) => MemberResponse.of(res)),
          });
        },
      }[type as SearchType]();
    } catch (e) {
      console.group(`[SearchService.search]`);
      console.log(e);
      console.groupEnd();
    }
  }
}
