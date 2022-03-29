import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from '@/module/member/domain/member.entity';
import { CreateMemberRequest } from '@/module/member/dto/request/create-member.request';
import { MemberGrpcResponse } from '@/module/member/dto/response/member.grpc.response';

@Injectable()
export class MemberService {
  constructor(@InjectRepository(Member) private readonly memberRepository: Repository<Member>) {}

  async createMember({ name, sex }: CreateMemberRequest): Promise<MemberGrpcResponse> {
    try {
      const member = await this.memberRepository.save(Member.of({ name, sex }));
      return MemberGrpcResponse.of({ memberId: member.id });
    } catch (e) {
      console.group(`[MemberService.createMember]`);
      console.error(e);
      console.groupEnd();
    }
  }
}
