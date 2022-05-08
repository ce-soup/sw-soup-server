import { Category } from '@/module/category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export interface ICategoryResponse {
  id: string;
  name: string;
  parent?: CategoryResponse;
}

export class CategoryResponse implements ICategoryResponse {
  @ApiProperty({
    description: 'ID'
  })
  id: string;

  @ApiProperty({
    description: '카테고리 이름'
  })
  name: string;

  @ApiProperty({
    description: '상위 카테고리'
  })
  parent?: CategoryResponse;

  constructor(id: string, name: string, parent: CategoryResponse) {
    this.id = id;
    this.name = name;
    this.parent = parent;
  }

  static of({ id, name, parent }: Category): CategoryResponse {
    return new CategoryResponse(
      id,
      name,
      parent ? CategoryResponse.of(parent) : null,
    );
  }
}
