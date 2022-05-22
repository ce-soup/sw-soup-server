import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { Group } from '@/module/group/entities/group.entity';
import { Review } from '@/module/review/entities/review.entity';

export interface IGroupReview {
  group: Group;
  groupId: string;
  review: Review;
  reviewId: string;
}

@Entity()
export class GroupReview extends Core implements IGroupReview {
  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column()
  groupId: string;

  @OneToOne(() => Review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @Column()
  reviewId: string;

  constructor(groupId: string, reviewId: string) {
    super();
    this.groupId = groupId;
    this.reviewId = reviewId;
  }

  static of({ groupId, reviewId }: Partial<IGroupReview>): GroupReview {
    return new GroupReview(groupId, reviewId);
  }
}
