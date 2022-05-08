import { HttpException, HttpStatus } from '@nestjs/common';

export class GroupNotFoundException extends HttpException {
  constructor() {
    super('그룹을 찾을 수 없습니다.', HttpStatus.BAD_REQUEST);
  }
}
