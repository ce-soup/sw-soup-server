import { HttpException, HttpStatus } from '@nestjs/common';

export class NotJoinGroupMemberException extends HttpException {
  constructor() {
    super('그룹에 가입되어 있지 않습니다.', HttpStatus.BAD_REQUEST);
  }
}
