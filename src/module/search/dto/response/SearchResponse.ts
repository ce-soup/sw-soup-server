import { ApiProperty } from '@nestjs/swagger';

import { GroupResponse } from '@/module/group/dto/response/group.response';
import { MemberResponse } from '@/module/member/dto/response/member.response';

export interface ISearchResponse {
  group?: GroupResponse[];
  member?: MemberResponse[];
}

export class SearchResponse implements ISearchResponse {
  @ApiProperty({
    type: GroupResponse,
    isArray: true,
    required: false,
  })
  readonly group?: GroupResponse[];
  @ApiProperty({
    type: MemberResponse,
    isArray: true,
    required: false,
  })
  readonly member?: MemberResponse[];

  constructor(group?: GroupResponse[], member?: MemberResponse[]) {
    this.group = group;
    this.member = member;
  }

  static of({ group, member }: ISearchResponse): SearchResponse {
    return new SearchResponse(group, member);
  }
}
