import { PickType } from '@nestjs/swagger';
import { CreateCommentRequest } from '@/module/post/comment/dto/request/create-comment.request';

export class UpdateCommentRequest extends PickType(CreateCommentRequest, [
  'content',
]) {}
