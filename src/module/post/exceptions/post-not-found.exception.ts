import { HttpException, HttpStatus } from '@nestjs/common';

export class PostNotFoundException extends HttpException {
  constructor() {
    super('그룹을 찾을 수 없거나 권한이 없습니다.', HttpStatus.NOT_FOUND);
  }
}
