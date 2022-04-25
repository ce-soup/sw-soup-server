import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Core } from '@/module/core/core.entity';
import { FileTypes } from '@/module/file/file.contants';
import { Member } from '@/module/member/entities/member.entity';

export interface IFile {
  key: string;
  type: FileTypes;
  mime: string;
  name: string;
  uploader: Member;
  uploaderId: string;
}

@Entity()
export class File extends Core implements IFile {
  @Column({ unique: true })
  key: string;

  @Column({ enum: FileTypes })
  type: FileTypes;

  @Column()
  mime: string;

  @Column()
  name: string;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploader_id' })
  uploader: Member;

  @Column()
  uploaderId: string;
}
