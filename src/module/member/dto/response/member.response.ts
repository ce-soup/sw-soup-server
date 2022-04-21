import { ApiProperty } from '@nestjs/swagger';

import { SexEnum } from '@/module/member/entities/member.enum';
import { Member } from '@/module/member/entities/member.entity';

export interface IMemberResponse {
  id: string;
  name: string;
  sex: SexEnum;
  bio: string;
}

export class MemberResponse implements IMemberResponse {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '성별' })
  sex: SexEnum;

  @ApiProperty({ description: '소개' })
  bio: string;

  constructor(id: string, name: string, sex: SexEnum, bio: string) {
    this.id = id;
    this.name = name;
    this.sex = sex;
    this.bio = bio;
  }

  static of({ id, name, sex, bio }: Member): MemberResponse {
    return new MemberResponse(id, name, sex, bio);
  }
}
