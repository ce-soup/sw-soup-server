import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from '@/module/post/entities/post.entity';
import { CreatePostRequest } from '@/module/post/dto/request/create-post.request';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async getAll() {}

  async getById(postId: string): Promise<Post> {
    try {
      return this.postRepository.findOne({
        where: { id: postId },
        relations: ['writer', 'group'],
      });
    } catch (e) {
      console.group(`[PostService.getById]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async create(
    writerId: string,
    groupId: string,
    request: Partial<CreatePostRequest>,
    fileIds: string[],
  ): Promise<Post> {
    try {
      const { id } = await this.postRepository.save(
        Post.of({ ...request, writerId, groupId, fileIds }),
      );

      return this.getById(id);
    } catch (e) {
      console.group(`[PostService.create]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async update() {}

  async delete() {}
}
