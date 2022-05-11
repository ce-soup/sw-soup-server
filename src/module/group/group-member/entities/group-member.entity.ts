import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { Group } from '@/module/group/entities/group.entity';
import { Member } from '@/module/member/entities/member.entity';

export interface IGroupMember {
  group: Group;
  groupId: string;
  member: Member;
  memberId: string;
  isAccepted: boolean;
}

@Entity()
export class GroupMember extends Core implements IGroupMember {
  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column()
  groupId: string;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  memberId: string;

  @Column({ nullable: true })
  isAccepted: boolean;

  constructor(groupId: string, memberId: string, isAccepted: boolean) {
    super();
    this.groupId = groupId;
    this.memberId = memberId;
    this.isAccepted = isAccepted;
  }

  static of({
    groupId,
    memberId,
    isAccepted,
  }: {
    groupId: string;
    memberId: string;
    isAccepted: boolean;
  }): GroupMember {
    return new GroupMember(groupId, memberId, isAccepted);
  }
}
