import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Group } from '@/module/group/entities/group.entity';
import { Member } from '@/module/member/entities/member.entity';

import { SearchController } from './controller/search.controller';
import { SearchService } from './services/search.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Member])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
