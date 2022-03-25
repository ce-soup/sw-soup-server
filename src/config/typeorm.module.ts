import { ConfigService } from '@nestjs/config';

import { SoupConfig } from '@/config/config.module';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export enum EnvironmentType {
  Production = 'production',
  Develop = 'development',
  Test = 'test',
}

export const CustomTypeOrmModuleOptions = (
  environmentType: EnvironmentType = EnvironmentType.Develop,
): TypeOrmModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService<SoupConfig>) => ({
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database:
      environmentType !== EnvironmentType.Test
        ? configService.get<string>('POSTGRES_DB')
        : configService.get<string>('POSTGRES_TEST_DB'),
    namingStrategy: new SnakeNamingStrategy(),
    autoLoadEntities: true,
    synchronize: environmentType !== EnvironmentType.Production,
    logging: environmentType !== EnvironmentType.Production,
    dropSchema: environmentType === EnvironmentType.Test,
  }),
});
