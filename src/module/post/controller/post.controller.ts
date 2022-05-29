import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthUser } from '@/module/auth/auth-user.decorators';
import { PostFacade } from '@/module/post/post.facade';
import { CreatePostRequest } from '@/module/post/dto/request/create-post.request';
import {
  AuthUserResponse,
  Role,
} from '@/module/auth/dto/response/AuthUserResponse';
import { PostResponse } from '@/module/post/dto/response/post.response';
import { RoleGuard } from '@/module/auth/role-guard.decorator';
import { UpdatePostRequest } from '@/module/post/dto/request/update-post.request';
import { PostType } from '@/module/post/entities/post.entity';

@ApiTags('PostController')
@Controller('/api/v1/post')
@RoleGuard([Role.General])
export class PostController {
  constructor(private readonly postFacade: PostFacade) {}

  @Get('/:groupId')
  @ApiParam({
    name: 'groupId',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'postType',
    type: 'enum',
    enum: PostType,
    required: false,
  })
  @ApiOperation({
    summary: 'GetPosts',
    description: '그룹의 글을 조회할 수 있어요.',
  })
  @ApiOkResponse({
    description: 'OK',
    type: [PostResponse],
  })
  async posts(
    @Param('groupId') groupId: string,
    @Query('postType') postType: PostType,
  ): Promise<PostResponse[]> {
    return this.postFacade.posts(groupId, postType);
  }

  @Get('/:groupId/:postId')
  async post(@Param('postId') postId: string) {
    return this.postFacade.post(postId);
  }

  @Post('/:groupId/new')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiParam({
    name: 'groupId',
    type: 'string',
    required: true,
  })
  @ApiOperation({
    summary: 'CreatePost',
    description: '글을 작성할 수 있어요.',
  })
  @ApiOkResponse({
    description: 'OK',
    type: PostResponse,
  })
  async create(
    @Param('groupId') groupId: string,
    @AuthUser() { memberId }: AuthUserResponse,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostRequest: CreatePostRequest,
  ): Promise<PostResponse> {
    return this.postFacade.create(memberId, groupId, files, createPostRequest);
  }

  @Patch('/:groupId/:postId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiParam({
    name: 'groupId',
    type: 'string',
    required: true,
  })
  @ApiParam({
    name: 'postId',
    type: 'string',
    required: true,
  })
  @ApiOperation({
    summary: 'UpdatePost',
    description: '글을 수정할 수 있어요.',
  })
  @ApiOkResponse({
    description: 'OK',
    type: PostResponse,
  })
  async update(
    @Param('groupId') groupId: string,
    @Param('postId') postId: string,
    @AuthUser() { memberId }: AuthUserResponse,
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() updatePostRequest: UpdatePostRequest,
  ): Promise<PostResponse> {
    return this.postFacade.update(
      memberId,
      groupId,
      postId,
      files,
      updatePostRequest,
    );
  }

  @Delete('/:groupId/:postId')
  @ApiParam({
    name: 'groupId',
    type: 'string',
    required: true,
  })
  @ApiParam({
    name: 'postId',
    type: 'string',
    required: true,
  })
  @ApiOperation({
    summary: 'DeletePost',
    description: '글을 삭제할 수 있어요.',
  })
  @ApiOkResponse({
    description: 'OK',
    type: Boolean,
  })
  async delete(
    @Param('groupId') groupId: string,
    @Param('postId') postId: string,
    @AuthUser() { memberId }: AuthUserResponse,
  ): Promise<boolean> {
    return this.postFacade.delete(memberId, groupId, postId);
  }
}
