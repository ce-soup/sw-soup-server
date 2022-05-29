import { Express } from 'express';
import { Injectable } from '@nestjs/common';

import { PostService } from '@/module/post/services/post.service';
import { PostResponse } from '@/module/post/dto/response/post.response';
import { CreatePostRequest } from '@/module/post/dto/request/create-post.request';
import { FileFacade } from '@/module/file/file.facade';
import { FileTypes } from '@/module/file/file.contants';
import { UpdatePostRequest } from '@/module/post/dto/request/update-post.request';
import { PostNotFoundException } from '@/module/post/exceptions/post-not-found.exception';

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
    files: Express.Multer.File[],
    { files: _, ...request }: CreatePostRequest,
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

  async update(
    writerId: string,
    groupId: string,
    postId: string,
    files: Express.Multer.File[],
    { files: _, ...request }: UpdatePostRequest,
  ) {
    await this.shouldBePostWriter(writerId, groupId, postId);

    const existingPost = await this.postService.getById(postId);

    if (files?.length > 0) {
      await Promise.all(
        existingPost.fileIds.map(async (fileId) => {
          await this.fileFacade.deleteById(fileId);
        }),
      );
    }

    const fileList = [];
    if (files?.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          fileList.push(
            await this.fileFacade.create(FileTypes.Group, file, writerId),
          );
        }),
      );
    }

    const post = await this.postService.update(
      postId,
      request,
      files?.length === 0 ? [] : fileList.map((file) => file.id),
    );

    return PostResponse.of(post, fileList);
  }

  async delete() {
    await this.postService.delete();
  }

  private async shouldBePostWriter(
    writerId: string,
    groupId: string,
    postId: string,
  ): Promise<void> {
    if (!(await this.postService.get({ writerId, groupId, postId }))) {
      throw new PostNotFoundException();
    }
  }
}
