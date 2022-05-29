import { HttpException, HttpStatus } from '@nestjs/common';

export class CouldNotCreateNoticeException extends HttpException {
  constructor() {
    super('공지글 작성 권한이 없습니다.', HttpStatus.FORBIDDEN);
  }
}
