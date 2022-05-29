import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post, PostType } from '@/module/post/entities/post.entity';
import { CreatePostRequest } from '@/module/post/dto/request/create-post.request';
import { UpdatePostRequest } from '@/module/post/dto/request/update-post.request';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async getAll(groupId: string, postType?: PostType): Promise<Post[]> {
    try {
      let query = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.writer', 'writer')
        .leftJoinAndSelect('post.group', 'group')
        .where('post.group_id = :groupId', { groupId });

      if (postType)
        query = query.andWhere('post.type = :postType', { postType });

      return query.getMany();
    } catch (e) {
      console.group(`[PostService.getAll]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async get({
    writerId,
    groupId,
    postId,
  }: {
    writerId?: string;
    groupId?: string;
    postId?: string;
  }): Promise<Post> {
    try {
      let query = await this.postRepository.createQueryBuilder();

      if (writerId) query = query.where('writer_id = :writerId', { writerId });
      if (groupId) query = query.andWhere('group_id = :groupId', { groupId });
      if (postId) query = query.andWhere('id = :postId', { postId });

      return query.getOne();
    } catch (e) {
      console.group(`[PostService.get]`);
      console.log(e);
      console.groupEnd();
    }
  }

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

  async update(
    postId: string,
    request: Partial<UpdatePostRequest>,
    fileIds?: string[],
  ) {
    try {
      const post = await this.getById(postId);

      if (request.title) post.title = request.title;
      if (request.content) post.content = request.content;
      if (fileIds !== null) post.fileIds = fileIds;

      await this.postRepository.save(post);

      return this.getById(postId);
    } catch (e) {
      console.group(`[PostService.update]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async delete(postId: string) {
    try {
      await this.postRepository.delete(postId);

      return true;
    } catch (e) {
      console.group(`[PostService.delete]`);
      console.log(e);
      console.groupEnd();
      return false;
    }
  }
}
