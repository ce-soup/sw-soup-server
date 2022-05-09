import { HttpException, HttpStatus } from '@nestjs/common';

export class UpdatePermissionException extends HttpException {
  constructor() {
    super('수정 권한이 없습니다.', HttpStatus.FORBIDDEN);
  }
}
