import { ApiProperty } from '@nestjs/swagger';

import { PostType } from '@/module/post/entities/post.entity';
import { Express } from 'express';

export class CreatePostRequest {
  @ApiProperty({ type: 'enum', enum: PostType, required: true })
  type: PostType;

  @ApiProperty({ required: true }) title: string;

  @ApiProperty({ required: true }) content: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: Express.Multer.File[];
}
