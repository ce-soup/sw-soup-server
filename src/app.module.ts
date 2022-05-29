import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomConfigModule } from '@/common/config.module';
import {
  CustomTypeOrmModuleOptions,
  EnvironmentType,
} from '@/common/typeorm.module';

import { MinioModule } from '@/module/minio/minio.module';
import { FileModule } from '@/module/file/file.module';
import { MemberModule } from './module/member/member.module';
import { GroupModule } from './module/group/group.module';
import { ReviewModule } from './module/review/review.module';
import { CategoryModule } from './module/category/category.module';
import { SearchModule } from './module/search/search.module';
import { PostModule } from './module/post/post.module';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync(
      CustomTypeOrmModuleOptions(process.env.NODE_ENV as EnvironmentType),
    ),
    MinioModule,
    FileModule,
    MemberModule,
    GroupModule,
    ReviewModule,
    CategoryModule,
    SearchModule,
    PostModule,
  ],
})
export class AppModule {}
