import { Column, Entity } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { SexEnum } from '@/module/member/domain/member.enum';

@Entity()
export class Member extends Core {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: SexEnum })
  sex: SexEnum;

  @Column()
  bio: string;

  @Column({ type: 'text', array: true })
  deviceTokens: string[];
}
