import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomConfigModule } from '@/common/config.module';
import { CustomTypeOrmModuleOptions, EnvironmentType } from '@/common/typeorm.module';
import { MemberModule } from './module/member/member.module';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync(CustomTypeOrmModuleOptions(process.env.NODE_ENV as EnvironmentType)),
    MemberModule,
  ],
})
export class AppModule {}
