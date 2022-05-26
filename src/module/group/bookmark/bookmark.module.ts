import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bookmark } from '@/module/group/bookmark/entities/bookmark.entity';
import { BookmarkService } from '@/module/group/bookmark/services/bookmark.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark])],
  providers: [BookmarkService],
  exports: [BookmarkService],
})
export class BookmarkModule {}
