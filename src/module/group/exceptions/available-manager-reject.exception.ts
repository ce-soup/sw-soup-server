import { HttpException, HttpStatus } from '@nestjs/common';

export class AvailableManagerRejectException extends HttpException {
  constructor() {
    super('메니저의 가입 상태는 변경이 불가능합니다.', HttpStatus.BAD_REQUEST);
  }
}
