import { Member } from '@/module/member/entities/member.entity';

export interface IMemberGrpcResponse {
  memberId: string;
}

export class MemberGrpcResponse implements IMemberGrpcResponse {
  memberId: string;

  constructor(memberId: string) {
    this.memberId = memberId;
  }

  static of({ id }: Member): MemberGrpcResponse {
    return new MemberGrpcResponse(id);
  }
}
