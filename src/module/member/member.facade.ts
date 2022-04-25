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
import { UpdateProfileRequest } from '@/module/member/dto/request/update-profile.request';
import { Express } from 'express';

@Injectable()
export class MemberFacade {
  constructor(private readonly memberService: MemberService, private readonly fileFacade: FileFacade) {}

  private async toMemberResponse(member: Member): Promise<MemberResponse> {
    const profileImage = await this.fileFacade.findByFileTypeAndMemberId(FileTypes.Profile, member.id);
    return MemberResponse.of({ ...member, profileImage: profileImage?.url ?? null });
  }

  async createMember(request: CreateMemberRequest): Promise<MemberGrpcResponse> {
    const member: Member = await this.memberService.createMember(request);
    return MemberGrpcResponse.of(member);
  }

  async findMemberById(request: FindMemberRequest): Promise<MemberResponse> {
    const member: Member = await this.memberService.findMemberById(request.id);
    return this.toMemberResponse(member);
  }

  async getMe(user: AuthUserResponse): Promise<MemberResponse> {
    const member: Member = await this.memberService.findMemberById(user.memberId);
    return this.toMemberResponse(member);
  }

  async updateProfileImage(file: Express.Multer.File, uploader: AuthUserResponse): Promise<FileResponse> {
    if (!file) throw new InvalidFileTypeException();
    return this.fileFacade.create(FileTypes.Profile, file, uploader.memberId);
  }

  async updateProfile(
    uploader: AuthUserResponse,
    request: UpdateProfileRequest,
    profileImage?: Express.Multer.File,
  ): Promise<MemberResponse> {
    if (request?.bio) {
      await this.memberService.updateMember(uploader.memberId, request.bio);
    }

    if (profileImage) {
      const existing = await this.fileFacade.findByFileTypeAndMemberId(FileTypes.Profile, uploader.memberId);
      if (existing) {
        await this.fileFacade.delete(existing.key);
      }
      await this.fileFacade.create(FileTypes.Profile, profileImage, uploader.memberId);
    }

    return this.toMemberResponse(await this.memberService.findMemberById(uploader.memberId));
  }
}
