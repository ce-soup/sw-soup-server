import { MemberResponse } from '@/module/member/dto/response/member.response';
import { IGroupMember } from '@/module/group/group-member/entities/group-member.entity';

export interface IGroupMemberResponse {
  member: MemberResponse;
  isAccepted?: boolean;
}

export class GroupMemberResponse implements IGroupMemberResponse {
  readonly member: MemberResponse;
  readonly isAccepted: boolean;

  constructor(member: MemberResponse, isAccepted: boolean) {
    this.member = member;
    this.isAccepted = isAccepted;
  }

  static of({ member, isAccepted }: IGroupMember): GroupMemberResponse {
    return new GroupMemberResponse(MemberResponse.of(member), isAccepted);
  }
}
