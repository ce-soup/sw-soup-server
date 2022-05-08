import {
  DayOfTheWeekEnum,
  GroupRecruitmentEnum,
  GroupScopeEnum,
  GroupStatusEnum,
  GroupTypeEnum,
} from '@/module/group/entities/types';
import { Review } from '@/module/review/entities/review.entity';
import { Group } from '@/module/group/entities/group.entity';
import { FileResponse } from '@/module/file/dto/response/file.response';
import { CategoryResponse } from '@/module/category/dto/response/category.response';
import { MemberResponse } from '@/module/member/dto/response/member.response';

export interface IGroupResponse {
  id: string;
  type: GroupTypeEnum;
  name: string;
  category: CategoryResponse;
  image: string;
  status: GroupStatusEnum;
  manager: MemberResponse;
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
  reviews: Review[];
  meetingLink?: string;
}

export class GroupResponse implements IGroupResponse {
  category: CategoryResponse;
  createdAt: Date;
  dayOfTheWeek: DayOfTheWeekEnum[];
  endDate: Date;
  endHour: number;
  endMinute: number;
  id: string;
  image: string;
  isOnline: boolean;
  manager: MemberResponse;
  meetingLink: string;
  name: string;
  personnel: number;
  recruitment: GroupRecruitmentEnum;
  reviews: Review[];
  scope: GroupScopeEnum;
  startDate: Date;
  startHour: number;
  startMinute: number;
  status: GroupStatusEnum;
  type: GroupTypeEnum;
  views: number;

  constructor(
    category: CategoryResponse,
    dayOfTheWeek: DayOfTheWeekEnum[],
    endDate: Date,
    endHour: number,
    endMinute: number,
    id: string,
    image: string,
    isOnline: boolean,
    manager: MemberResponse,
    meetingLink: string,
    name: string,
    personnel: number,
    recruitment: GroupRecruitmentEnum,
    reviews: Review[],
    scope: GroupScopeEnum,
    startDate: Date,
    startHour: number,
    startMinute: number,
    status: GroupStatusEnum,
    type: GroupTypeEnum,
    views: number,
  ) {
    this.category = category;
    this.dayOfTheWeek = dayOfTheWeek;
    this.endDate = endDate;
    this.endHour = endHour;
    this.endMinute = endMinute;
    this.id = id;
    this.image = image;
    this.isOnline = isOnline;
    this.manager = manager;
    this.meetingLink = meetingLink;
    this.name = name;
    this.personnel = personnel;
    this.recruitment = recruitment;
    this.reviews = reviews ?? null;
    this.scope = scope;
    this.startDate = startDate;
    this.startHour = startHour;
    this.startMinute = startMinute;
    this.status = status;
    this.type = type;
    this.views = views;
  }

  static of({
    category,
    dayOfTheWeek,
    endDate,
    endHour,
    endMinute,
    id,
    image,
    isOnline,
    manager,
    meetingLink,
    name,
    personnel,
    recruitment,
    reviews,
    scope,
    startDate,
    startHour,
    startMinute,
    status,
    type,
    views,
  }: Group): GroupResponse {
    return new GroupResponse(
      CategoryResponse.of(category),
      dayOfTheWeek,
      endDate,
      endHour,
      endMinute,
      id,
      FileResponse.of(image).url,
      isOnline,
      MemberResponse.of(manager),
      meetingLink,
      name,
      personnel,
      recruitment,
      reviews,
      scope,
      startDate,
      startHour,
      startMinute,
      status,
      type,
      views,
    );
  }
}
