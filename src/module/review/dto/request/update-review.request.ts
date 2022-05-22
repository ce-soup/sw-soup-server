import { ApiProperty } from '@nestjs/swagger';

export interface IUpdateReviewRequest {
  content: string;
}

export interface _IUpdateReviewRequest extends IUpdateReviewRequest {
  reviewId: string;
  writerId: string;
  content: string;
}

export class UpdateReviewRequest implements IUpdateReviewRequest {
  @ApiProperty() readonly content: string;
}
