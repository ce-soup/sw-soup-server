import { Express } from 'express';
import { Injectable } from '@nestjs/common';

import { PostService } from '@/module/post/services/post.service';
import { PostResponse } from '@/module/post/dto/response/post.response';
import { CreatePostRequest } from '@/module/post/dto/request/create-post.request';
import { FileFacade } from '@/module/file/file.facade';
import { FileTypes } from '@/module/file/file.contants';
import { UpdatePostRequest } from '@/module/post/dto/request/update-post.request';
import { PostNotFoundException } from '@/module/post/exceptions/post-not-found.exception';
import { PostType } from '@/module/post/entities/post.entity';
import { GroupFacade } from '@/module/group/group.facade';
import { GroupNotFoundException } from '@/module/group/exceptions/group-not-found.exception';
import { CouldNotCreateNoticeException } from '@/module/post/exceptions/could-not-create-notice.exception';
import { CommentService } from '@/module/post/comment/services/comment.service';

@Injectable()
export class PostFacade {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly fileFacade: FileFacade,
    private readonly groupFacade: GroupFacade,
  ) {}

  async posts(groupId: string, postType?: PostType) {
    const postList = await this.postService.getAll(groupId, postType);

    return Promise.all(
      postList.map(async (post) => {
        const fileList = await this.fileFacade.findByIds(post.fileIds);
        return PostResponse.of(post, fileList);
      }),
    );
  }

  async post(groupId: string, postId: string): Promise<PostResponse> {
    const post = await this.postService.getById(postId);
    const comments = await this.commentService.getByPostId(postId);
    const files = await this.fileFacade.findByIds(post.fileIds);

    return PostResponse.of({ ...post, comments }, files);
  }

  async create(
    writerId: string,
    groupId: string,
    files: Express.Multer.File[],
    { files: _, ...request }: CreatePostRequest,
  ): Promise<PostResponse> {
    const group = await this.groupFacade.getOne(groupId);
    if (!group) {
      throw new GroupNotFoundException();
    }

    if (request.type === PostType.Notice && writerId !== group.manager.id) {
      throw new CouldNotCreateNoticeException();
    }

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

  async delete(
    writerId: string,
    groupId: string,
    postId: string,
  ): Promise<boolean> {
    await this.shouldBePostWriter(writerId, groupId, postId);

    const post = await this.postService.getById(postId);
    await Promise.all(
      post.fileIds.map(async (fileId) => {
        await this.fileFacade.deleteById(fileId);
      }),
    );

    return await this.postService.delete(postId);
  }

  async shouldBeExist(groupId: string, postId: string): Promise<void> {
    if (!(await this.postService.get({ groupId, postId }))) {
      throw new PostNotFoundException();
    }
  }

  async shouldBePostWriter(
    writerId: string,
    groupId: string,
    postId: string,
  ): Promise<void> {
    if (!(await this.postService.get({ writerId, groupId, postId }))) {
      throw new PostNotFoundException();
    }
  }
}
