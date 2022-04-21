import { ApiProperty } from '@nestjs/swagger';

export interface IFileResponse {
  id: string;
  key: string;
}

export class FileResponse implements IFileResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  key: string;

  constructor(id: string, key: string) {
    this.id = id;
    this.key = key;
  }

  static of({ id, key }: IFileResponse): FileResponse {
    return new FileResponse(id, `http://${process.env.MINIO_HOST}:${process.env.MINIO_PORT}/bucket/${key}`);
  }
}
