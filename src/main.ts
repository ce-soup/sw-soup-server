import '@/config/env';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { eurekaClientStart } from '@/common/eureka-client';
import { AuthGuard } from '@/module/auth/auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();

  SwaggerModule.setup(
    'swagger',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('soup service server')
        .setDescription('soup service server api documents')
        .setVersion('1.0')
        .addBasicAuth(
          {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            scheme: 'Bearer',
          },
          'Authorization',
        )
        .build(),
    ),
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  );

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
