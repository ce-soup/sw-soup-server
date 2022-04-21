import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Member } from '@/module/member/entities/member.entity';
import { FileModule } from '@/module/file/file.module';
import { MinioModule } from '@/module/minio/minio.module';
import { MemberController } from './controller/member.controller';
import { MemberGrpcController } from '@/module/member/controller/member.grpc.controller';
import { MemberFacade } from '@/module/member/member.facade';
import { MemberService } from './services/member.service';
import { FileFacade } from '@/module/file/file.facade';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), FileModule, MinioModule],
  controllers: [MemberController, MemberGrpcController],
  providers: [MemberFacade, MemberService, FileFacade],
})
export class MemberModule {}
