import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from '@/module/member/entities/member.entity';
import { CreateMemberRequest } from '@/module/member/dto/request/create-member.request';

@Injectable()
export class MemberService {
  constructor(@InjectRepository(Member) private readonly memberRepository: Repository<Member>) {}

  async createMember({ name, sex }: CreateMemberRequest): Promise<Member> {
    try {
      return this.memberRepository.save(Member.of({ name, sex }));
    } catch (e) {
      console.group(`[MemberService.createMember]`);
      console.error(e);
      console.groupEnd();
    }
  }

  async findMemberById(id: string): Promise<Member> {
    try {
      return this.memberRepository.findOne({ where: { id } });
    } catch (e) {
      console.group(`[MemberService.findMemberById]`);
      console.error(e);
      console.groupEnd();
    }
  }

  async updateMember(id: string, bio: string): Promise<Member> {
    try {
      const member: Member = await this.memberRepository.findOne({ where: { id } });
      member.bio = bio;
      return this.memberRepository.save(member);
    } catch (e) {
      console.group(`[MemberService.updateMember]`);
      console.error(e);
      console.groupEnd();
    }
  }
}
