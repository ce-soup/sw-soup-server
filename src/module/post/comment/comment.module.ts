import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/module/post/comment/entities/comment.entity';
import { CommentFacade } from '@/module/post/comment/comment.facade';
import { CommentService } from '@/module/post/comment/services/comment.service';
import { PostFacade } from '@/module/post/post.facade';
import { PostService } from '@/module/post/services/post.service';
import { PostModule } from '@/module/post/post.module';
import { FileModule } from '@/module/file/file.module';
import { GroupModule } from '@/module/group/group.module';
import { Post } from '@/module/post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post]),
    forwardRef(() => PostModule),
    FileModule,
    GroupModule,
  ],
  providers: [CommentFacade, CommentService, PostFacade, PostService],
  exports: [CommentFacade, CommentService],
})
export class CommentModule {}
