import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

/**
 * @author himit0131@gmail.com
 * @link https://docs.nestjs.com/techniques/configuration
 * */
const validationSchema = Joi.object({
  // Soup Server
  APP_PORT: Joi.number().default(3000),

  // Database
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_TEST_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),

  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
});

export const CustomConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['env/.env'],
  validationSchema,
});
