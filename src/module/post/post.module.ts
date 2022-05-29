import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '@/module/post/entities/post.entity';
import { PostController } from './controller/post.controller';
import { PostFacade } from '@/module/post/post.facade';
import { PostService } from './services/post.service';

import { FileModule } from '@/module/file/file.module';
import { GroupModule } from '@/module/group/group.module';
import { CommentModule } from '@/module/post/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    CommentModule,
    FileModule,
    GroupModule,
  ],
  providers: [PostFacade, PostService],
  controllers: [PostController],
  exports: [PostFacade, PostService],
})
export class PostModule {}
