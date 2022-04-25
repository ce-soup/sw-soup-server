import { ApiProperty } from '@nestjs/swagger';

export interface IFileResponse {
  id: string;
  key: string;
  url: string;
}

export class FileResponse implements IFileResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  key: string;
  @ApiProperty()
  url: string;

  constructor(id: string, key: string) {
    this.id = id;
    this.key = key;
    this.url = `http://${process.env.SERVER_URL ?? 'localhost'}:${process.env.MINIO_PORT}/bucket/${key}`;
  }

  static of({ id, key }: { id: string; key: string }): FileResponse {
    return new FileResponse(id, key);
  }
}
