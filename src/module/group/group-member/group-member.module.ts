import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupMember } from '@/module/group/group-member/entities/group-member.entity';
import { GroupMemberService } from './services/group-member.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember])],
  providers: [GroupMemberService],
  exports: [GroupMemberService],
})
export class GroupMemberModule {}
