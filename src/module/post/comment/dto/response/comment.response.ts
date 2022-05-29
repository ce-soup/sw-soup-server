import { ApiProperty } from '@nestjs/swagger';

import { Comment } from '@/module/post/comment/entities/comment.entity';
import { MemberResponse } from '@/module/member/dto/response/member.response';

export class CommentResponse {
  @ApiProperty() id: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  @ApiProperty() writer: MemberResponse;
  @ApiProperty() content: string;
  @ApiProperty({ default: null }) children: CommentResponse[];

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    writer: MemberResponse,
    content: string,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.writer = writer;
    this.content = content;
  }

  static of({
    id,
    createdAt,
    updatedAt,
    writer,
    content,
  }: Comment): CommentResponse {
    return new CommentResponse(
      id,
      createdAt,
      updatedAt,
      MemberResponse.of(writer),
      content,
    );
  }
}
