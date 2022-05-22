import { HttpException, HttpStatus } from '@nestjs/common';

export class NotReviewWriterException extends HttpException {
  constructor() {
    super('리뷰 작성자가 아닙니다.', HttpStatus.BAD_REQUEST);
  }
}
