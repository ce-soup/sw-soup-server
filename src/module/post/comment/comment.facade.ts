import { Injectable } from '@nestjs/common';

import { CommentService } from '@/module/post/comment/services/comment.service';
import { PostFacade } from '@/module/post/post.facade';
import { CreateCommentRequest } from '@/module/post/comment/dto/request/create-comment.request';
import { CommentResponse } from '@/module/post/comment/dto/response/comment.response';
import { UpdateCommentRequest } from '@/module/post/comment/dto/request/update-comment.request';
import { NotCommentWriterException } from '@/module/post/comment/exceptions/not-comment-writer.exception';

@Injectable()
export class CommentFacade {
  constructor(
    private readonly commentService: CommentService,
    private readonly postFacade: PostFacade,
  ) {}

  async create(
    memberId: string,
    groupId: string,
    postId: string,
    request: CreateCommentRequest,
  ): Promise<CommentResponse> {
    await this.postFacade.shouldBeExist(groupId, postId);

    const comment = await this.commentService.create(memberId, postId, request);

    return CommentResponse.of(comment);
  }

  async update(
    memberId: string,
    groupId: string,
    postId: string,
    commentId: string,
    request: UpdateCommentRequest,
  ): Promise<CommentResponse> {
    await this.postFacade.shouldBeExist(groupId, postId);
    await this.shouldBeWriter(memberId, commentId);

    const comment = await this.commentService.update(commentId, request);

    return CommentResponse.of(comment);
  }

  async delete(
    memberId: string,
    groupId: string,
    postId: string,
    commentId: string,
  ): Promise<boolean> {
    await this.postFacade.shouldBeExist(groupId, postId);
    await this.shouldBeWriter(memberId, commentId);

    return this.commentService.delete(commentId);
  }

  private async shouldBeWriter(
    memberId: string,
    commentId: string,
  ): Promise<void> {
    const comment = await this.commentService.getById(commentId);
    if (comment.writerId !== memberId) {
      throw new NotCommentWriterException();
    }
  }
}
