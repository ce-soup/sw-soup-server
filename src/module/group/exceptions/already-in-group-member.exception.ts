import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyInGroupMemberException extends HttpException {
  constructor() {
    super('이미 그룹에 참가중입니다.', HttpStatus.BAD_REQUEST);
  }
}
