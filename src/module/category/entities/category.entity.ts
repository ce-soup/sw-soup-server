import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Core } from '@/module/core/core.entity';

export interface ICategory {
  name: string;
  parent?: Category;
  parentId?: string;
}

@Entity()
export class Category extends Core implements ICategory {
  @Column()
  name: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'parent_id' })
  parent?: Category;

  parentId: string;

  constructor(name: string, parentId?: string) {
    super();
    this.name = name;
    this.parentId = parentId;
  }

  static of({ name, parentId }: ICategory): Category {
    return new Category(name, parentId)
  }
}
