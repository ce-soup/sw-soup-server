import { ApiProperty } from '@nestjs/swagger';

import { MemberResponse } from '@/module/member/dto/response/member.response';
import { Post, PostType } from '@/module/post/entities/post.entity';
import { FileResponse } from '@/module/file/dto/response/file.response';
import { CommentResponse } from '@/module/post/comment/dto/response/comment.response';

export class PostResponse {
  @ApiProperty() id: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  @ApiProperty() writer: MemberResponse;
  @ApiProperty() type: PostType;
  @ApiProperty() title: string;
  @ApiProperty() content: string;
  @ApiProperty() files?: FileResponse[];
  @ApiProperty({ nullable: true }) comments?: CommentResponse[];

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    writer: MemberResponse,
    type: PostType,
    title: string,
    content: string,
    files: FileResponse[] = null,
    comments: CommentResponse[],
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.writer = writer;
    this.type = type;
    this.title = title;
    this.content = content;
    this.files = files;
    this.comments = comments;
  }

  static of(
    { id, createdAt, updatedAt, writer, type, title, content, comments }: Post,
    files: FileResponse[],
  ): PostResponse {
    return new PostResponse(
      id,
      createdAt,
      updatedAt,
      MemberResponse.of(writer),
      type,
      title,
      content,
      files,
      comments?.map((comment) => CommentResponse.of(comment)),
    );
  }
}
