import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

import { SoupConfig } from '@/common/config.module';
import * as Buffer from 'buffer';

@Injectable()
export class MinioService {
  private readonly client: Client;
  private readonly bucket = 'bucket';

  constructor(private readonly configService: ConfigService<SoupConfig>) {
    this.client = new Client({
      endPoint: configService.get('MINIO_HOST'),
      port: configService.get('MINIO_PORT'),
      useSSL: configService.get('MINIO_SSL'),
      accessKey: configService.get('MINIO_ROOT_USER'),
      secretKey: configService.get('MINIO_ROOT_PASSWORD'),
    });
  }

  async upload(key: string, body: Buffer): Promise<void> {
    try {
      await this.client.putObject(this.bucket, key, body);
    } catch (e) {
      console.group('[MinioService.upload]');
      console.log(e);
      console.groupEnd();
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucket, key);
    } catch (e) {
      console.group('[MinioService.upload]');
      console.log(e);
      console.groupEnd();
    }
  }
}
