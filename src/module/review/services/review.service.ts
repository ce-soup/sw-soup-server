import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from '@/module/review/entities/review.entity';
import { ICreateReviewRequest } from '@/module/review/dto/request/create-review.request';
import { IUpdateReviewRequest } from '@/module/review/dto/request/update-review.request';
import { IDeleteReviewRequest } from '@/module/review/dto/request/delete-review.request';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getById(id: string): Promise<Review> {
    try {
      return this.reviewRepository.findOne({
        where: { id },
        relations: ['writer'],
      });
    } catch (e) {
      console.group(`[ReviewService.getById]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async write({ writerId, content }: ICreateReviewRequest): Promise<Review> {
    try {
      const review = await this.reviewRepository.save(
        Review.of({ writerId, content }),
      );

      return this.reviewRepository.findOne({
        where: { id: review.id },
        relations: ['writer'],
      });
    } catch (e) {
      console.group(`[ReviewService.write]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async update({ reviewId, content }: IUpdateReviewRequest): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOne({
        where: { id: reviewId },
      });
      review.content = content;

      await this.reviewRepository.save(review);

      return this.reviewRepository.findOne({
        where: { id: review.id },
        relations: ['writer'],
      });
    } catch (e) {
      console.group(`[ReviewService.update]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async delete({ reviewId }: IDeleteReviewRequest): Promise<true> {
    try {
      await this.reviewRepository.delete(reviewId);

      return true;
    } catch (e) {
      console.group(`[ReviewService.delete]`);
      console.log(e);
      console.groupEnd();
    }
  }
}
