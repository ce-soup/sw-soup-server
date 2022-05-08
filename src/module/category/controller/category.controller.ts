import { Body, Controller, Get, Post } from '@nestjs/common';

import { RoleGuard } from '@/module/auth/role-guard.decorator';
import { Role } from '@/module/auth/dto/response/AuthUserResponse';

import { CategoryResponse } from '@/module/category/dto/response/category.response';
import { CategoryService } from '@/module/category/services/category.service';
import { CreateCategoryRequest } from '@/module/category/dto/request/create-category.request';

@Controller('/api/v1/category')
@RoleGuard([Role.Admin])
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async categories(): Promise<CategoryResponse[]> {
    return this.categoryService.getAll();
  }

  @Post('/new')
  async create(
    @Body() createCategoryRequest: CreateCategoryRequest,
  ): Promise<CategoryResponse> {
    return this.categoryService.create(createCategoryRequest);
  }
}
