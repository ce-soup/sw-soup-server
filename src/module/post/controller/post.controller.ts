import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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

@ApiTags('PostController')
@Controller('/api/v1/post')
@RoleGuard([Role.General])
export class PostController {
  constructor(private readonly postFacade: PostFacade) {}

  @Get('/:groupId')
  async posts() {
    return this.postFacade.posts();
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
    return this.postFacade.create(memberId, groupId, createPostRequest, files);
  }

  @Patch('/:groupId/:postId')
  async update() {
    return this.postFacade.update();
  }

  @Delete('/:postId')
  async delete() {
    return this.postFacade.delete();
  }
}
