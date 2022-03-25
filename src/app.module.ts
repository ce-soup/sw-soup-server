import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomConfigModule } from '@/config/config.module';
import { CustomTypeOrmModuleOptions, EnvironmentType } from '@/config/typeorm.module';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync(CustomTypeOrmModuleOptions(process.env.NODE_ENV as EnvironmentType)),
  ],
})
export class AppModule {}

console.log(process.env.NODE_ENV);
