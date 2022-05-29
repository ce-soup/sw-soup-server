import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from '@/module/post/comment/entities/comment.entity';
import { CreateCommentRequest } from '@/module/post/comment/dto/request/create-comment.request';
import { UpdateCommentRequest } from '@/module/post/comment/dto/request/update-comment.request';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getById(commentId: string): Promise<Comment> {
    try {
      return this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['writer'],
      });
    } catch (e) {
      console.group(`[CommentService.getById]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async getByPostId(postId: string): Promise<Comment[]> {
    try {
      return this.commentRepository.find({
        where: { postId },
        relations: ['writer'],
        order: { createdAt: 'ASC' },
      });
    } catch (e) {
      console.group(`[CommentService.getByPostId]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async create(
    memberId: string,
    postId: string,
    request: CreateCommentRequest,
  ): Promise<Comment> {
    try {
      const comment = await this.commentRepository.save(
        Comment.of({
          writerId: memberId,
          postId,
          content: request.content,
        }),
      );

      return this.getById(comment.id);
    } catch (e) {
      console.group(`[CommentService.create]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async update(commentId: string, request: UpdateCommentRequest) {
    try {
      const comment = await this.getById(commentId);
      comment.content = request.content;
      await this.commentRepository.save(comment);

      return this.getById(comment.id);
    } catch (e) {
      console.group(`[CommentService.update]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async delete(commentId: string): Promise<boolean> {
    try {
      await this.commentRepository.delete(commentId);

      return true;
    } catch (e) {
      console.group(`[CommentService.delete]`);
      console.log(e);
      console.groupEnd();

      return false;
    }
  }
}
