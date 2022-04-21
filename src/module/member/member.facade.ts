import { Injectable } from '@nestjs/common';

import { MemberService } from '@/module/member/services/member.service';
import { FileFacade } from '@/module/file/file.facade';
import { Member } from '@/module/member/entities/member.entity';
import { CreateMemberRequest } from '@/module/member/dto/request/create-member.request';
import { MemberGrpcResponse } from '@/module/member/dto/response/member.grpc.response';
import { FindMemberRequest } from '@/module/member/dto/request/find-member.request';
import { MemberResponse } from '@/module/member/dto/response/member.response';
import { AuthUserResponse } from '@/module/auth/dto/response/AuthUserResponse';
import { FileTypes } from '@/module/file/file.contants';
import { FileResponse } from '@/module/file/dto/response/file.response';
import { InvalidFileTypeException } from '@/module/member/exceptions/invalid-file-type.exception';

@Injectable()
export class MemberFacade {
  constructor(private readonly memberService: MemberService, private readonly fileFacade: FileFacade) {}

  async createMember(request: CreateMemberRequest): Promise<MemberGrpcResponse> {
    const member: Member = await this.memberService.createMember(request);
    return MemberGrpcResponse.of(member);
  }

  async findMemberById(request: FindMemberRequest): Promise<MemberResponse> {
    const member: Member = await this.memberService.findMemberById(request.id);
    return MemberResponse.of(member);
  }

  async getMe(user: AuthUserResponse): Promise<MemberResponse> {
    const member: Member = await this.memberService.findMemberById(user.memberId);
    return MemberResponse.of(member);
  }

  async updateProfileImage(file: Express.Multer.File, uploader: AuthUserResponse): Promise<FileResponse> {
    if (!file) throw new InvalidFileTypeException();
    return this.fileFacade.create(FileTypes.Profile, file, uploader.memberId);
  }
}
