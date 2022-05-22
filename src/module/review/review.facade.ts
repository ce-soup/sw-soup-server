import { Injectable } from '@nestjs/common';

import { ReviewService } from '@/module/review/services/review.service';
import { ReviewResponse } from '@/module/review/dto/response/review.response';
import { _ICreateReviewRequest } from '@/module/review/dto/request/create-review.request';
import { _IUpdateReviewRequest } from '@/module/review/dto/request/update-review.request';
import { _IDeleteReviewRequest } from '@/module/review/dto/request/delete-review.request';
import { NotReviewWriterException } from '@/module/review/exceptions/not-review-writer.exception';
import { Review } from '@/module/review/entities/review.entity';

@Injectable()
export class ReviewFacade {
  constructor(private readonly reviewService: ReviewService) {}

  async write(
    request: _ICreateReviewRequest,
  ): Promise<[Review, ReviewResponse]> {
    const review = await this.reviewService.write(request);

    return [review, ReviewResponse.of(review)];
  }

  async update(
    request: _IUpdateReviewRequest,
  ): Promise<[Review, ReviewResponse]> {
    const review = await this.reviewService.getById(request.reviewId);
    if (review.writerId !== review.writerId) {
      throw new NotReviewWriterException();
    }

    const updatedReview = await this.reviewService.update(request);
    return [updatedReview, ReviewResponse.of(updatedReview)];
  }

  async delete(request: _IDeleteReviewRequest): Promise<true> {
    const review = await this.reviewService.getById(request.reviewId);
    if (review.writerId !== review.writerId) {
      throw new NotReviewWriterException();
    }

    await this.reviewService.delete(request);
    return true;
  }
}
