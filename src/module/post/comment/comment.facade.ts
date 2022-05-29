import { Injectable } from '@nestjs/common';

import { CommentService } from '@/module/post/comment/services/comment.service';
import { PostFacade } from '@/module/post/post.facade';
import { CreateCommentRequest } from '@/module/post/comment/dto/request/create-comment.request';
import { CommentResponse } from '@/module/post/comment/dto/response/comment.response';

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

  async update() {}

  async delete() {}
}
