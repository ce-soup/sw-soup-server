import { HttpException, HttpStatus } from '@nestjs/common';

export class FullOfParticipantsException extends HttpException {
  constructor() {
    super('참여 신청이 가득찼습니다.', HttpStatus.BAD_REQUEST);
  }
}
