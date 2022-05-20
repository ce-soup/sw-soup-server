import { MemberResponse } from '@/module/member/dto/response/member.response';
import { Review } from '@/module/review/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';

export interface IReviewResponse {
  id: string;
  writer: MemberResponse;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ReviewResponse implements IReviewResponse {
  @ApiProperty() readonly id: string;
  @ApiProperty() readonly writer: MemberResponse;
  @ApiProperty() readonly content: string;
  @ApiProperty() readonly createdAt: Date;
  @ApiProperty() readonly updatedAt: Date;

  constructor(
    id: string,
    write: MemberResponse,
    content: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.writer = write;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static of({
    id,
    writer,
    content,
    createdAt,
    updatedAt,
  }: Review): ReviewResponse {
    return new ReviewResponse(
      id,
      MemberResponse.of(writer),
      content,
      createdAt,
      updatedAt,
    );
  }
}
