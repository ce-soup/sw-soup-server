import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from '@/module/post/comment/entities/comment.entity';
import { CreateCommentRequest } from '@/module/post/comment/dto/request/create-comment.request';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

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
        Comment.of({ writerId: memberId, postId, content: request.content }),
      );

      if (request.parentId) {
        await this.appendChildren(request.parentId, comment);
      }

      return this.commentRepository.findOne({
        where: { id: comment.id },
        relations: ['writer'],
      });
    } catch (e) {
      console.group(`[CommentService.create]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async update() {}

  async delete() {}

  private async appendChildren(
    parentId: string,
    child: Comment,
  ): Promise<void> {
    try {
      const parent = await this.commentRepository.findOne({
        where: { id: parentId },
      });
      parent.children.push(child);
      await this.commentRepository.save(parent);
    } catch (e) {
      console.group(`[CommentService.appendChildren]`);
      console.log(e);
      console.groupEnd();
    }
  }
}
