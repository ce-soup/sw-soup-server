import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import * as process from 'process';

/**
 * @author himit0131@gmail.com
 * @link https://docs.nestjs.com/techniques/configuration
 * */
export interface SoupConfig {
  // Node
  NODE_ENV: 'production' | 'development' | 'test';

  // Soup Server
  APP_PORT: number;

  // Database
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_DB: string;
  POSTGRES_TEST_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;

  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;

  // Minio
  MINIO_HOST: string;
  MINIO_PORT: number;
  MINIO_SSL: boolean;
  MINIO_ROOT_USER: string;
  MINIO_ROOT_PASSWORD: string;
  MINIO_ACCESS_USER: string;
  MINIO_SECRET_PASSWORD: string;

  // Grpc
  GRPC_PORT: number;

  // Eureka
  EUREKA_HOST: string;
  EUREKA_PORT: string;
}

const validationSchema = Joi.object({
  // Node
  NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),

  // Soup Server
  APP_PORT: Joi.number().default(3000),

  // Database
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_TEST_DB: Joi.string().default('test_db'),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),

  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),

  // Minio
  MINIO_HOST: Joi.string().required(),
  MINIO_PORT: Joi.number().default(9000),
  MINIO_SSL: Joi.boolean().default(false),
  MINIO_ROOT_USER: Joi.string().required(),
  MINIO_ROOT_PASSWORD: Joi.string().required(),
  MINIO_ACCESS_USER: Joi.string().required(),
  MINIO_SECRET_PASSWORD: Joi.string().required(),

  // Grpc
  GRPC_PORT: Joi.number().default(5000),

  // Eureka
  EUREKA_HOST: Joi.string().default('localhost'),
  EUREKA_PORT: Joi.number().default(8761),
});

export const CustomConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  ignoreEnvFile: process.env.NODE_ENV === 'production',
  envFilePath: ['env/.env'],
  validationSchema,
});
