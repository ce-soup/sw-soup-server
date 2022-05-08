export interface ICreateCategoryRequest {
  name: string;
  parentId?: string;
}

export class CreateCategoryRequest implements ICreateCategoryRequest {
  name: string;
  parentId: string;
}
