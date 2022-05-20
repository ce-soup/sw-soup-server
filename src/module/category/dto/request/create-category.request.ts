import { ApiProperty } from '@nestjs/swagger';

export interface ICreateCategoryRequest {
  name: string;
  parentId?: string;
}

export class CreateCategoryRequest implements ICreateCategoryRequest {
  @ApiProperty() name: string;
  @ApiProperty() parentId: string;
}
