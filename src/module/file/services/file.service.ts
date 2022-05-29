import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { File } from '@/module/file/entities/file.entity';
import { FileTypes } from '@/module/file/file.contants';
import {
  FileResponse,
  IFileResponse,
} from '@/module/file/dto/response/file.response';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {}

  async findByIds(fileIds: string[]): Promise<File[]> {
    try {
      return this.fileRepository.find({
        where: { id: In(fileIds) },
      });
    } catch (e) {
      console.group(`[FileService.findByIds]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async findById(fileId: string): Promise<File> {
    try {
      return this.fileRepository.findOne({
        where: { id: fileId },
      });
    } catch (e) {
      console.group(`[FileService.findById]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async findByFileTypeAndMemberId(
    fileType: FileTypes,
    memberId: string,
  ): Promise<File | null> {
    try {
      return this.fileRepository.findOne({
        where: { type: fileType, uploaderId: memberId },
      });
    } catch (e) {
      console.group('[FileService.create]');
      console.log(e);
      console.groupEnd();
    }
  }

  async create(
    type: FileTypes,
    key: string,
    mime: string,
    name: string,
    uploaderId: string,
  ): Promise<FileResponse> {
    try {
      const { generatedMaps } = await this.fileRepository.insert({
        type,
        key,
        mime,
        name,
        uploaderId,
      });

      return FileResponse.of({ ...generatedMaps[0], key } as IFileResponse);
    } catch (e) {
      console.group('[FileService.create]');
      console.log(e);
      console.groupEnd();
    }
  }

  async deleteByKey(key: string): Promise<void> {
    try {
      await this.fileRepository.delete({ key });
    } catch (e) {
      console.group('[FileService.create]');
      console.log(e);
      console.groupEnd();
    }
  }
}
