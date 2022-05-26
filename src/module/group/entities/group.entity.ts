import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  DayOfTheWeekEnum,
  GroupRecruitmentEnum,
  GroupScopeEnum,
  GroupStatusEnum,
  GroupTypeEnum,
} from '@/module/group/entities/types';

import { Core } from '@/module/core/core.entity';
import { Category } from '@/module/category/entities/category.entity';
import { Member } from '@/module/member/entities/member.entity';
import { File } from '@/module/file/entities/file.entity';

export interface IGroup {
  type: GroupTypeEnum;
  name: string;
  category: Category;
  categoryId: string;
  image?: File;
  imageId: string;
  status: GroupStatusEnum;
  manager: Member;
  managerId: string;
  personnel: number;
  isOnline: boolean;
  scope: GroupScopeEnum;
  recruitment: GroupRecruitmentEnum;
  startDate: Date;
  endDate: Date;
  startHour: number;
  startMinute: number;
  endHour?: number;
  endMinute?: number;
  dayOfTheWeek: DayOfTheWeekEnum[];
  views: number;
  meetingLink?: string;
}

@Entity()
export class Group extends Core implements IGroup {
  @Column({
    type: 'enum',
    enum: GroupTypeEnum,
  })
  type: GroupTypeEnum;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => File, {
    nullable: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'image_id' })
  image?: File;

  @Column({ nullable: true })
  imageId: string;

  @Column({
    type: 'enum',
    enum: GroupStatusEnum,
    default: GroupStatusEnum.Ready,
  })
  status: GroupStatusEnum;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'manager_id' })
  manager: Member;

  @Column()
  managerId: string;

  @Column({
    default: 0,
  })
  personnel: number;

  @Column({
    default: true,
  })
  isOnline: boolean;

  @Column({
    default: GroupScopeEnum.Public,
  })
  scope: GroupScopeEnum;

  @Column({
    type: 'enum',
    enum: GroupRecruitmentEnum,
    default: GroupRecruitmentEnum.FirstCome,
  })
  recruitment: GroupRecruitmentEnum;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  startHour: number;

  @Column()
  startMinute: number;

  @Column({
    nullable: true,
  })
  endHour?: number;

  @Column({
    nullable: true,
  })
  endMinute?: number;

  @Column({
    type: 'enum',
    array: true,
    enum: DayOfTheWeekEnum,
  })
  dayOfTheWeek: DayOfTheWeekEnum[];

  @Column({
    default: 0,
  })
  views: number;

  @Column({
    nullable: true,
  })
  meetingLink?: string;

  constructor(
    type: GroupTypeEnum,
    name: string,
    categoryId: string,
    imageId: string,
    status: GroupStatusEnum = GroupStatusEnum.Ready,
    managerId: string,
    personnel: number,
    isOnline: boolean,
    scope: GroupScopeEnum,
    recruitment: GroupRecruitmentEnum,
    startDate: Date,
    endDate: Date,
    startHour: number,
    startMinute: number,
    endHour: number = undefined,
    endMinute: number = undefined,
    dayOfTheWeek: DayOfTheWeekEnum[],
    meetingLink: string = undefined,
  ) {
    super();
    this.type = type;
    this.name = name;
    this.categoryId = categoryId;
    this.imageId = imageId;
    this.status = status;
    this.managerId = managerId;
    this.personnel = personnel;
    this.isOnline = isOnline;
    this.scope = scope;
    this.recruitment = recruitment;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startHour = startHour;
    this.startMinute = startMinute;
    this.endHour = endHour;
    this.endMinute = endMinute;
    this.dayOfTheWeek =
      typeof dayOfTheWeek === 'string'
        ? JSON.parse(`${dayOfTheWeek}`)
        : dayOfTheWeek;
    this.views = 0;
    this.meetingLink = meetingLink;
  }

  static of({
    type,
    name,
    categoryId,
    imageId,
    status,
    managerId,
    personnel,
    isOnline,
    scope,
    recruitment,
    startDate,
    endDate,
    startHour,
    startMinute,
    endHour,
    endMinute,
    dayOfTheWeek,
    meetingLink,
  }: Partial<Group>): Group {
    return new Group(
      type,
      name,
      categoryId,
      imageId,
      status,
      managerId,
      personnel,
      isOnline,
      scope,
      recruitment,
      startDate,
      endDate,
      startHour,
      startMinute,
      endHour,
      endMinute,
      dayOfTheWeek,
      meetingLink,
    );
  }
}
