import { Injectable } from '@nestjs/common';

import { ReviewService } from '@/module/review/services/review.service';
import { ReviewResponse } from '@/module/review/dto/response/review.response';
import { ICreateReviewRequest } from '@/module/review/dto/request/create-review.request';
import { IUpdateReviewRequest } from '@/module/review/dto/request/update-review.request';
import { NotReviewWriterException } from '@/module/review/exceptions/not-review-writer.exception';
import { IDeleteReviewRequest } from '@/module/review/dto/request/delete-review.request';

@Injectable()
export class ReviewFacade {
  constructor(private readonly reviewService: ReviewService) {}

  async write(request: ICreateReviewRequest): Promise<ReviewResponse> {
    const review = await this.reviewService.write(request);

    return ReviewResponse.of(review);
  }

  async update(request: IUpdateReviewRequest): Promise<ReviewResponse> {
    const review = await this.reviewService.getById(request.reviewId);
    if (review.writerId !== review.writerId) {
      throw new NotReviewWriterException();
    }

    const updatedReview = await this.reviewService.update(request);
    return ReviewResponse.of(updatedReview);
  }

  async delete(request: IDeleteReviewRequest): Promise<true> {
    const review = await this.reviewService.getById(request.reviewId);
    if (review.writerId !== review.writerId) {
      throw new NotReviewWriterException();
    }

    await this.reviewService.delete(request);
    return true;
  }
}
