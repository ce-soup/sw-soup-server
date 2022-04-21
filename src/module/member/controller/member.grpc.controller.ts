import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import 'reflect-metadata';

import { MemberFacade } from '@/module/member/member.facade';
import { CreateMemberReq, decodeSexEnum, MemberRes } from '@/__codegen__/rpc';
import { CreateMemberRequest } from '@/module/member/dto/request/create-member.request';

@Controller('/member')
export class MemberGrpcController {
  constructor(private readonly memberFacade: MemberFacade) {}

  @GrpcMethod('MemberService', 'CreateMember')
  async createMember({ name, sex }: CreateMemberReq): Promise<MemberRes> {
    return await this.memberFacade.createMember(CreateMemberRequest.of({ name, sex: decodeSexEnum[sex] }));
  }
}
