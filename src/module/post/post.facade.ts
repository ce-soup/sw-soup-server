import { Express } from 'express';
import { Injectable } from '@nestjs/common';

import { PostService } from '@/module/post/services/post.service';
import { PostResponse } from '@/module/post/dto/response/post.response';
import { CreatePostRequest } from '@/module/post/dto/request/create-post.request';
import { FileFacade } from '@/module/file/file.facade';
import { FileTypes } from '@/module/file/file.contants';

@Injectable()
export class PostFacade {
  constructor(
    private readonly postService: PostService,
    private readonly fileFacade: FileFacade,
  ) {}

  async posts() {
    await this.postService.getAll();
  }

  async post(postId: string) {
    await this.postService.getById(postId);
  }

  async create(
    writerId: string,
    groupId: string,
    { files: _, ...request }: CreatePostRequest,
    files: Express.Multer.File[],
  ): Promise<PostResponse> {
    const fileList = await Promise.all(
      files.map(async (file) => {
        return await this.fileFacade.create(FileTypes.Group, file, writerId);
      }),
    );

    const post = await this.postService.create(
      writerId,
      groupId,
      request,
      fileList.map((file) => file.id),
    );

    return PostResponse.of(post, fileList);
  }

  async update() {
    await this.postService.update();
  }

  async delete() {
    await this.postService.delete();
  }
}
