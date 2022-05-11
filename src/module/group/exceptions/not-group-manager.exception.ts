import { HttpException, HttpStatus } from '@nestjs/common';

export class NotGroupManagerException extends HttpException {
  constructor() {
    super('그룹 메니저가 아닙니다.', HttpStatus.BAD_REQUEST);
  }
}
