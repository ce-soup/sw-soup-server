import {
  DayOfTheWeekEnum,
  GroupScopeEnum,
} from '@/module/group/entities/types';
import { ApiProperty } from '@nestjs/swagger';

export interface IUpdateGroupRequest {
  name?: string;
  categoryId?: string;
  personnel?: number;
  isOnline?: boolean;
  scope?: GroupScopeEnum;
  startDate?: Date;
  endDate?: Date;
  startHour?: number;
  startMinute?: number;
  endHour?: number;
  endMinute?: number;
  dayOfTheWeek?: DayOfTheWeekEnum[];
  meetingLink?: string;
}

export class UpdateGroupRequest implements IUpdateGroupRequest {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  categoryId?: string;

  @ApiProperty({ required: false })
  personnel?: number;

  @ApiProperty({ required: false })
  isOnline?: boolean;

  @ApiProperty({
    enum: GroupScopeEnum,
    required: false,
  })
  scope: GroupScopeEnum;

  @ApiProperty({ required: false })
  startDate?: Date;

  @ApiProperty({ required: false })
  endDate?: Date;

  @ApiProperty({
    type: 'number',
    required: false,
  })
  startHour?: number;

  @ApiProperty({
    type: 'number',
    required: false,
  })
  startMinute?: number;

  @ApiProperty({ type: 'number', required: false })
  endHour?: number;

  @ApiProperty({ type: 'number', required: false })
  endMinute?: number;

  @ApiProperty({
    enum: DayOfTheWeekEnum,
    isArray: true,
    required: false,
  })
  dayOfTheWeek?: DayOfTheWeekEnum[];

  @ApiProperty({ required: false })
  meetingLink?: string;
}
