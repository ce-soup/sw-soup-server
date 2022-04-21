import '@/config/env';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { GrpcOptions } from '@nestjs/microservices';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { eurekaClientStart } from '@/common/eureka-client';
import { swaggerDocumentOptions, swaggerOptions } from '@/common/swagger';
import { AuthGuard } from '@/module/auth/auth.guard';
import { ValidationPipe } from './common/validation-pipe.config';
import { grpcOptions } from '@/common/grpc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // cors
  app.enableCors();

  // swagger
  SwaggerModule.setup('swagger', app, SwaggerModule.createDocument(app, swaggerOptions), swaggerDocumentOptions);

  // grpc
  app.connectMicroservice<GrpcOptions>(grpcOptions(join(__dirname, '..', 'proto')));

  // eureka
  eurekaClientStart();

  await app.startAllMicroservices();
  await app.useGlobalGuards(new AuthGuard());
  await app.useGlobalPipes(ValidationPipe);
  await app.listen(+(process.env.APP_PORT ?? '3000'));
}

bootstrap();
