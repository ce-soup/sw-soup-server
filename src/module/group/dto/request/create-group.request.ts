import {
  DayOfTheWeekEnum,
  GroupRecruitmentEnum,
  GroupScopeEnum,
  GroupTypeEnum,
} from '@/module/group/entities/types';
import { ApiProperty } from '@nestjs/swagger';

export interface ICreateGroupRequest {
  type: GroupTypeEnum;
  name: string;
  categoryId: string;
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
  meetingLink?: string;
}

export class CreateGroupRequest implements ICreateGroupRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @ApiProperty({
    enum: GroupTypeEnum,
  })
  type: GroupTypeEnum;

  @ApiProperty()
  name: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty({
    type: 'number',
  })
  personnel: number;

  @ApiProperty()
  isOnline: boolean;

  @ApiProperty({
    enum: GroupScopeEnum,
  })
  scope: GroupScopeEnum;

  @ApiProperty({
    enum: GroupRecruitmentEnum,
  })
  recruitment: GroupRecruitmentEnum;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({
    type: 'number',
  })
  startHour: number;

  @ApiProperty({
    type: 'number',
  })
  startMinute: number;

  @ApiProperty({ type: 'number', required: false })
  endHour?: number;

  @ApiProperty({ type: 'number', required: false })
  endMinute?: number;

  @ApiProperty({
    enum: DayOfTheWeekEnum,
    isArray: true,
  })
  dayOfTheWeek: DayOfTheWeekEnum[];

  @ApiProperty({ required: false })
  meetingLink?: string;
}
