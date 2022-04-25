import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidFileTypeException extends HttpException {
  constructor() {
    super('유효하지 않은 파일 형식입니다.', HttpStatus.BAD_REQUEST);
  }
}
