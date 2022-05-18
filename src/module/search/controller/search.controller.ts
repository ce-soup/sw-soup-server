import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { RoleGuard } from '@/module/auth/role-guard.decorator';
import { Role } from '@/module/auth/dto/response/AuthUserResponse';
import { SearchService } from '@/module/search/services/search.service';
import { SearchType } from '@/module/search/dto/types';
import {
  OrderGroupEnum,
  OrderGroupQuery,
} from '@/module/group/order-group-query.decorator';
import { GroupStatusEnum, GroupTypeEnum } from '@/module/group/entities/types';
import { SearchResponse } from '@/module/search/dto/response/SearchResponse';
import { FilterGroupQuery } from '@/module/group/filter-group-query.decorator';

@ApiTags('SearchController')
@Controller('/api/v1/search')
@RoleGuard([Role.General])
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':searchType')
  @ApiParam({
    name: 'searchType',
    required: true,
    enum: SearchType,
  })
  @ApiQuery({
    name: 'search',
    required: true,
    type: 'string',
  })
  @OrderGroupQuery()
  @FilterGroupQuery()
  @ApiOperation({
    summary: 'Search',
    description: '그룹과 유저를 검색할 수 있어요.',
  })
  @ApiOkResponse({ description: 'OK', type: SearchResponse })
  async search(
    @Param('searchType') searchType: SearchType,
    @Query('search') search: string,
    @Query('order') order?: OrderGroupEnum,
    @Query('type') groupType?: GroupTypeEnum,
    @Query('minPersonnel') minPersonnel?: string,
    @Query('maxPersonnel') maxPersonnel?: string,
    @Query('isOnline') isOnline?: string,
    @Query('status') status?: GroupStatusEnum,
  ): Promise<SearchResponse> {
    return this.searchService.search(
      search,
      searchType,
      {
        order,
      },
      {
        groupType,
        minPersonnel: minPersonnel ? parseInt(minPersonnel) : undefined,
        maxPersonnel: maxPersonnel ? parseInt(maxPersonnel) : undefined,
        isOnline: isOnline ? isOnline === 'true' : undefined,
        status,
      },
    );
  }
}
