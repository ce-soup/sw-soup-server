import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomConfigModule } from '@/common/config.module';
import { CustomTypeOrmModuleOptions, EnvironmentType } from '@/common/typeorm.module';

import { MinioModule } from '@/module/minio/minio.module';
import { FileModule } from '@/module/file/file.module';
import { MemberModule } from './module/member/member.module';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync(CustomTypeOrmModuleOptions(process.env.NODE_ENV as EnvironmentType)),
    MinioModule,
    FileModule,
    MemberModule,
  ],
})
export class AppModule {}
