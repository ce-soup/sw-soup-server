import '@/config/env';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { eurekaClientStart } from '@/common/eureka-client';
import { AuthGuard } from '@/module/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const protoDir = join(__dirname, '..', 'proto');
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: `${process.env.NODE_ENV === 'production' ? 'soup' : 'localhost'}:${+(process.env.GRPC_PORT ?? '5000')}`,
      package: 'soup',
      protoPath: [join(protoDir, 'member.proto')],
      loader: {
        longs: Number,
        defaults: true,
      },
    },
  });

  eurekaClientStart();

  await app.startAllMicroservices();
  await app.useGlobalGuards(new AuthGuard());
  await app.listen(+(process.env.APP_PORT ?? '3000'));
}

bootstrap();
