import { Column, Entity } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { SexEnum } from '@/module/member/domain/member.enum';

export interface IMember {
  name: string;
  sex: SexEnum;
  bio?: string | null;
  deviceTokens?: string[];
}

@Entity()
export class Member extends Core implements IMember {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: SexEnum })
  sex: SexEnum;

  @Column({ nullable: true })
  bio: string | null;

  @Column({ type: 'text', array: true })
  deviceTokens: string[];

  constructor(name: string, sex: SexEnum, bio: string | null, deviceTokens: string[]) {
    super();
    this.name = name;
    this.sex = sex;
    this.bio = bio;
    this.deviceTokens = deviceTokens;
  }

  static of({ name, sex, bio, deviceTokens }: IMember): Member {
    return new Member(name, sex, bio ?? null, deviceTokens ?? []);
  }
}
