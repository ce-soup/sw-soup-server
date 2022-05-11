import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupController } from './controller/group.controller';
import { GroupFacade } from '@/module/group/group.facade';
import { GroupService } from './services/group.service';

import { Group } from '@/module/group/entities/group.entity';
import { GroupMemberModule } from '@/module/group/group-member/group-member.module';
import { FileModule } from '@/module/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), GroupMemberModule, FileModule],
  controllers: [GroupController],
  providers: [GroupFacade, GroupService],
  exports: [GroupMemberModule],
})
export class GroupModule {}
