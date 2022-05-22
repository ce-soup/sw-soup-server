import { ApiProperty } from '@nestjs/swagger';

export interface ICreateReviewRequest {
  content: string;
}

export interface _ICreateReviewRequest extends ICreateReviewRequest {
  writerId: string;
  content: string;
}

export class CreateReviewRequest implements ICreateReviewRequest {
  @ApiProperty() readonly content: string;
}
