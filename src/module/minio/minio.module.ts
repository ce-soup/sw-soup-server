import { Module } from '@nestjs/common';
import { MinioService } from '@/module/minio/services/minio.service';

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
