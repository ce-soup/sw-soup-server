import { Column, Entity, JoinColumn, ManyToOne, TreeChildren } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { Member } from '@/module/member/entities/member.entity';
import { Post } from '@/module/post/entities/post.entity';

export interface IComment {
  writer: Member;
  post: Post;
  children: Comment[];
  content: string;
}

@Entity()
export class Comment extends Core implements IComment {
  @ManyToOne(() => Member)
  @JoinColumn({ name: 'writer_id' })
  writer: Member;

  @Column()
  writerId: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column()
  postId: string;

  @TreeChildren()
  children: Comment[];

  @Column()
  content: string;

  constructor(writerId: string, postId: string, content: string) {
    super();
    this.writerId = writerId;
    this.postId = postId;
    this.content = content;
  }

  static of({ writerId, postId, content }: Partial<Comment>): Comment {
    return new Comment(writerId, postId, content);
  }
}
