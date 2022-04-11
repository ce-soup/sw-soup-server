import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/module/guard/auth.guard';

@Controller('/api/v1/member')
@UseGuards(AuthGuard)
export class MemberController {
  @Get('/me')
  async getMe(): Promise<boolean> {
    return true;
  }
}
