import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { Member } from '@/module/member/entities/member.entity';
import { Group } from '@/module/group/entities/group.entity';

export enum PostType {
  General = 'General',
  Notice = 'Notice',
  Question = 'Question',
}

export interface IPost {
  writer: Member;
  type: PostType;
  title: string;
  content: string;
  fileIds: string[];
}

@Entity()
export class Post extends Core implements IPost {
  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'writer_id' })
  writer: Member;

  @Column()
  writerId: string;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column()
  groupId: string;

  @Column({ type: 'enum', enum: PostType })
  type: PostType;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'text', array: true })
  fileIds: string[];

  constructor(
    writerId: string,
    groupId: string,
    type: PostType,
    title: string,
    content: string,
    fileIds: string[],
  ) {
    super();
    this.writerId = writerId;
    this.groupId = groupId;
    this.type = type;
    this.title = title;
    this.content = content;
    this.fileIds = fileIds;
  }

  static of({
    writerId,
    groupId,
    type,
    title,
    content,
    fileIds,
  }: Partial<Post>): Post {
    return new Post(writerId, groupId, type, title, content, fileIds);
  }
}
