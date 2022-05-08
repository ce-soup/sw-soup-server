import { Column, Entity, ManyToOne } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { Member } from '@/module/member/entities/member.entity';

export interface IReview {
  writer: Member;
  content: string;
}

@Entity()
export class Review extends Core implements IReview {
  @ManyToOne(() => Member)
  writer: Member;

  @Column()
  content: string;
}
