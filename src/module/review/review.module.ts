import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '@/module/review/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
})
export class ReviewModule {}
