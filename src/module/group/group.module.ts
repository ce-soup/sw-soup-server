import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupController } from './controller/group.controller';
import { GroupFacade } from '@/module/group/group.facade';
import { GroupService } from './services/group.service';

import { Group } from '@/module/group/entities/group.entity';
import { FileModule } from '@/module/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), FileModule],
  controllers: [GroupController],
  providers: [GroupFacade, GroupService],
})
export class GroupModule {}
