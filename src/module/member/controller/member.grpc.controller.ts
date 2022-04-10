import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { MemberService } from '@/module/member/services/member.service';
import { CreateMemberReq, decodeSexEnum, MemberRes } from '@/__codegen__/rpc';
import { CreateMemberRequest } from '@/module/member/dto/request/create-member.request';

@Controller('/member')
export class MemberGrpcController {
  constructor(private readonly memberService: MemberService) {}

  @GrpcMethod('MemberService', 'CreateMember')
  async createMember({ name, sex }: CreateMemberReq): Promise<MemberRes> {
    return await this.memberService.createMember(CreateMemberRequest.of({ name, sex: decodeSexEnum[sex] }));
  }
}
