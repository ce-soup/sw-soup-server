import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { File } from '@/module/file/entities/file.entity';
import { FileFacade } from '@/module/file/file.facade';
import { FileService } from '@/module/file/services/file.service';
import { MinioService } from '@/module/minio/services/minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileFacade, FileService, MinioService],
  exports: [FileFacade, FileService],
})
export class FileModule {}
