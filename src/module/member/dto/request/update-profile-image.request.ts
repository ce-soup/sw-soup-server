import { Express } from 'express';
import { ApiProperty } from '@nestjs/swagger';

export interface IUpdateProfileImageRequest {
  file: Express.Multer.File;
}

export class UpdateProfileImageRequest implements IUpdateProfileImageRequest {
  @ApiProperty()
  file: Express.Multer.File;
}
