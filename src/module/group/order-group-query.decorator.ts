import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export enum OrderGroupEnum {
  Recent = 'Recent',
  View = 'View',
}

export const orderFiled = {
  [OrderGroupEnum.Recent]: 'created_at',
  [OrderGroupEnum.View]: 'views',
};

export const OrderGroupQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'order',
      required: false,
      enum: OrderGroupEnum,
    }),
  );
