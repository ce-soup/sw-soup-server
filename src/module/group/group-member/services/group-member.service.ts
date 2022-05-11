import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupMember } from '@/module/group/group-member/entities/group-member.entity';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
  ) {}

  /**
   * GroupId로 그룹 조회하기
   * */
  async getByGroupId(groupId: string): Promise<GroupMember[]> {
    try {
      return this.groupMemberRepository.find({
        where: {
          groupId,
        },
      });
    } catch (e) {
      console.group(`[GroupMemberService.getByGroupId]`);
      console.log(e);
      console.groupEnd();
    }
  }

  /**
   * MemberId로 그룹 조회하기
   * */
  async getByMemberId(memberId: string): Promise<GroupMember[]> {
    try {
      return this.groupMemberRepository.find({
        where: { memberId },
        relations: ['group'],
      });
    } catch (e) {
      console.group(`[GroupMemberService.getByMemberId]`);
      console.log(e);
      console.groupEnd();
    }
  }

  /**
   * GroupId와 MemberId로 그룹 조회하기
   * */
  async getByGroupIdAndMemberId(
    groupId: string,
    memberId: string,
  ): Promise<GroupMember> {
    try {
      return this.groupMemberRepository.findOne({
        where: {
          groupId,
          memberId,
        },
      });
    } catch (e) {
      console.group(`[GroupMemberService.getByGroupIdAndMemberId]`);
      console.log(e);
      console.groupEnd();
    }
  }

  /**
   * 그룹 참여 신청
   * */
  async join(
    groupId: string,
    memberId: string,
    isAccepted = false,
  ): Promise<GroupMember> {
    try {
      return this.groupMemberRepository.save(
        GroupMember.of({ groupId, memberId, isAccepted }),
      );
    } catch (e) {
      console.group(`[GroupMemberService.join]`);
      console.log(e);
      console.groupEnd();
    }
  }

  /**
   * 그룹 참여 신청 취소
   * */
  async cancel(groupId: string, memberId: string): Promise<void> {
    try {
      const groupMember = await this.getByGroupIdAndMemberId(groupId, memberId);
      await this.groupMemberRepository.delete(groupMember.id);
    } catch (e) {
      console.group(`[GroupMemberService.cancel]`);
      console.log(e);
      console.groupEnd();
    }
  }

  /**
   * 그룹 참여 허가
   * */
  async accept(groupId: string, memberId: string): Promise<boolean> {
    try {
      const groupMember = await this.getByGroupIdAndMemberId(groupId, memberId);
      groupMember.isAccepted = true;
      await this.groupMemberRepository.save(groupMember);

      return true;
    } catch (e) {
      console.group(`[]`);
      console.log(e);
      console.groupEnd();
    }
  }

  /**
   * 그룹 참여 불허가
   * */
  async reject(groupId: string, memberId: string): Promise<boolean> {
    try {
      const groupMember = await this.getByGroupIdAndMemberId(groupId, memberId);
      groupMember.isAccepted = false;
      await this.groupMemberRepository.save(groupMember);

      return true;
    } catch (e) {
      console.group(`[]`);
      console.log(e);
      console.groupEnd();
    }
  }
}
