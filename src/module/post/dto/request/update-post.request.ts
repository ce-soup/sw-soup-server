import { OmitType, PartialType } from '@nestjs/swagger';

import { CreatePostRequest } from '@/module/post/dto/request/create-post.request';

export class UpdatePostRequest extends OmitType(
  PartialType(CreatePostRequest),
  ['type'],
) {}
