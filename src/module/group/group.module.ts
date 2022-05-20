import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupController } from './controller/group.controller';
import { GroupFacade } from '@/module/group/group.facade';
import { GroupService } from './services/group.service';

import { Group } from '@/module/group/entities/group.entity';
import { GroupReview } from '@/module/group/entities/group-review.entity';
import { GroupMemberModule } from '@/module/group/group-member/group-member.module';
import { FileModule } from '@/module/file/file.module';
import { ReviewModule } from '@/module/review/review.module';
import { ReviewFacade } from '@/module/review/review.facade';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupReview]),
    GroupMemberModule,
    FileModule,
    ReviewModule,
  ],
  controllers: [GroupController],
  providers: [GroupFacade, GroupService, ReviewFacade],
  exports: [GroupMemberModule],
})
export class GroupModule {}
