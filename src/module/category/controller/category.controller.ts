import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleGuard } from '@/module/auth/role-guard.decorator';
import { Role } from '@/module/auth/dto/response/AuthUserResponse';

import { CategoryResponse } from '@/module/category/dto/response/category.response';
import { CategoryService } from '@/module/category/services/category.service';
import { CreateCategoryRequest } from '@/module/category/dto/request/create-category.request';

@ApiTags('CategoryController')
@Controller('/api/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({
    summary: 'GetCategories',
    description: '카데고리 목록을 조회할 수 있어요.',
  })
  @ApiOkResponse({
    description: 'OK',
    type: [CategoryResponse],
  })
  @RoleGuard([Role.General])
  async categories(): Promise<CategoryResponse[]> {
    return this.categoryService.getAll();
  }

  @Post('/new')
  @ApiOperation({
    summary: 'CreateCategory',
    description: '카데고리를 생성할 수 있어요.',
  })
  @ApiOkResponse({
    description: 'OK',
    type: CategoryResponse,
  })
  @RoleGuard([Role.Admin])
  async create(
    @Body() createCategoryRequest: CreateCategoryRequest,
  ): Promise<CategoryResponse> {
    return this.categoryService.create(createCategoryRequest);
  }
}
