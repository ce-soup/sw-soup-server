import { MemberResponse } from '@/module/member/dto/response/member.response';
import { Review } from '@/module/review/entities/review.entity';

export interface IReviewResponse {
  id: string;
  writer: MemberResponse;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ReviewResponse implements IReviewResponse {
  readonly id: string;
  readonly writer: MemberResponse;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

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
