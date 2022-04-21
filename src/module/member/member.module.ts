import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member } from '@/module/member/entities/member.entity';
import { MemberController } from './controller/member.controller';
import { MemberGrpcController } from '@/module/member/controller/member.grpc.controller';
import { MemberService } from './services/member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController, MemberGrpcController],
  providers: [MemberService],
})
export class MemberModule {}
