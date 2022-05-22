import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { Member } from '@/module/member/entities/member.entity';

export interface IReview {
  writer: Member;
  writerId: string;
  content: string;
}

@Entity()
export class Review extends Core implements IReview {
  @ManyToOne(() => Member)
  @JoinColumn({ name: 'writer_id' })
  writer: Member;

  @Column()
  writerId: string;

  @Column()
  content: string;

  constructor(writerId: string, content: string) {
    super();
    this.writerId = writerId;
    this.content = content;
  }

  static of({ writerId, content }: Partial<Review>): Review {
    return new Review(writerId, content);
  }
}
