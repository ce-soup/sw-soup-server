import { Category } from '@/module/category/entities/category.entity';

export interface ICategoryResponse {
  id: string;
  name: string;
  parent?: CategoryResponse;
}

export class CategoryResponse implements ICategoryResponse {
  id: string;
  name: string;
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
