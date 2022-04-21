import { Injectable } from '@nestjs/common';
import { getExtension } from 'mime';
import { v4 as generateId } from 'uuid';

import { FileService } from '@/module/file/services/file.service';
import { MinioService } from '@/module/minio/services/minio.service';
import { FileTypes, KeyPrefixes } from '@/module/file/file.contants';
import { FileResponse } from '@/module/file/dto/response/file.response';

@Injectable()
export class FileFacade {
  constructor(private readonly fileService: FileService, private readonly minioService: MinioService) {}

  private static getFileKey(id: string, fileType: FileTypes, mimeType: string): string {
    const prefix = KeyPrefixes[fileType];
    const extension = getExtension(mimeType);
    return `${prefix}/${id}.${extension}`;
  }

  async create(fileType: FileTypes, file: Express.Multer.File, uploaderId: string): Promise<FileResponse> {
    const id = generateId();
    const fileKey = FileFacade.getFileKey(id, fileType, file.mimetype);

    return await Promise.all([
      await this.fileService.create(fileType, fileKey, file.mimetype, file.originalname, uploaderId),
      await this.minioService.upload(fileKey, file.buffer),
    ]).then((res) => res[0]);
  }
}
