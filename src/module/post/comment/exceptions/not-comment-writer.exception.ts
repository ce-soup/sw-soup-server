import { HttpException, HttpStatus } from '@nestjs/common';

export class NotCommentWriterException extends HttpException {
  constructor() {
    super('댓글 작성자가 아닙니다.', HttpStatus.BAD_REQUEST);
  }
}
