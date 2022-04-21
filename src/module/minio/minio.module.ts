import { Module } from '@nestjs/common';
import { MinioService } from '@/module/minio/services/minio.service';

@Module({
  exports: [MinioService],
})
export class MinioModule {}
