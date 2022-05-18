import { GroupStatusEnum, GroupTypeEnum } from '@/module/group/entities/types';

export interface FilterGroupRequest {
  groupType: GroupTypeEnum;
  minPersonnel: number;
  maxPersonnel: number;
  isOnline: boolean;
  status: GroupStatusEnum;
}
