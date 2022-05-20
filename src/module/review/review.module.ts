import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Review } from '@/module/review/entities/review.entity';
import { ReviewFacade } from '@/module/review/review.facade';
import { ReviewService } from '@/module/review/services/review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewFacade, ReviewService],
  exports: [ReviewFacade, ReviewService],
})
export class ReviewModule {}
