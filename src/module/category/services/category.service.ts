import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@/module/category/entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryResponse } from '@/module/category/dto/response/category.response';
import { CreateCategoryRequest } from '@/module/category/dto/request/create-category.request';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAll(): Promise<CategoryResponse[]> {
    try {
      const categories = await this.categoryRepository.find();
      return categories.map((category) => CategoryResponse.of(category));
    } catch (e) {
      console.group(`[CategoryService.getAll]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async create(request: CreateCategoryRequest): Promise<CategoryResponse> {
    try {
      const category = await this.categoryRepository.save(Category.of(request));
      return CategoryResponse.of(category);
    } catch (e) {
      console.group(`[CategoryService.create]`);
      console.log(e);
      console.groupEnd();
    }
  }
}
