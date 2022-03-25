import { Module } from '@nestjs/common';

import { CustomConfigModule } from '@/config/config.module';

@Module({
  imports: [CustomConfigModule],
})
export class AppModule {}
