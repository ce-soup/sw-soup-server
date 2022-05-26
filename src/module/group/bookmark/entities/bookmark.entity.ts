import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { Member } from '@/module/member/entities/member.entity';
import { Group } from '@/module/group/entities/group.entity';

@Entity()
export class Bookmark extends Core {
  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  memberId: string;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column()
  groupId: string;

  constructor(memberId: string, groupId: string) {
    super();
    this.memberId = memberId;
    this.groupId = groupId;
  }

  static of({
    memberId,
    groupId,
  }: {
    memberId: string;
    groupId: string;
  }): Bookmark {
    return new Bookmark(memberId, groupId);
  }
}
