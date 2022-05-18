import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { GroupStatusEnum, GroupTypeEnum } from '@/module/group/entities/types';

export const FilterGroupQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'type',
      required: false,
      enum: GroupTypeEnum,
    }),
    ApiQuery({
      name: 'minPersonnel',
      required: false,
      type: 'number',
    }),
    ApiQuery({
      name: 'maxPersonnel',
      required: false,
      type: 'number',
    }),
    ApiQuery({
      name: 'isOnline',
      required: false,
      type: 'boolean',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: GroupStatusEnum,
    }),
  );
