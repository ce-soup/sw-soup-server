import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { eurekaClientStart } from '@/common/eureka-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  eurekaClientStart();

  await app.listen(3000);
}

bootstrap();
