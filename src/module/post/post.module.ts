import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '@/module/post/entities/post.entity';
import { PostController } from './controller/post.controller';
import { PostFacade } from '@/module/post/post.facade';
import { PostService } from './services/post.service';

import { FileModule } from '@/module/file/file.module';
import { GroupModule } from '@/module/group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), FileModule, GroupModule],
  providers: [PostFacade, PostService],
  controllers: [PostController],
})
export class PostModule {}
