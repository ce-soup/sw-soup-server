import '@/config/env';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { eurekaClientStart } from '@/common/eureka-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const protoDir = join(__dirname, '..', 'proto');
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: `localhost:${+(process.env.GRPC_PORT ?? '5000')}`,
      package: 'soup',
      protoPath: [join(protoDir, 'soup/v1/member.proto')],
      loader: {
        longs: Number,
        defaults: true,
      },
    },
  });

  eurekaClientStart();

  await app.listen(+(process.env.APP_PORT ?? '3000'));
}

bootstrap();
