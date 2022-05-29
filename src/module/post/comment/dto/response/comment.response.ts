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
    children: CommentResponse[],
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.writer = writer;
    this.content = content;
    this.children = children;
  }

  static of({
    id,
    createdAt,
    updatedAt,
    writer,
    content,
    children,
  }: Comment): CommentResponse {
    return new CommentResponse(
      id,
      createdAt,
      updatedAt,
      MemberResponse.of(writer),
      content,
      children?.map((comment) => CommentResponse.of(comment)),
    );
  }
}
