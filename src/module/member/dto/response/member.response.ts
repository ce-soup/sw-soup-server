import { ApiProperty } from '@nestjs/swagger';

import { SexEnum } from '@/module/member/entities/member.enum';

export interface IMemberResponse {
  id: string;
  name: string;
  sex: SexEnum;
  bio: string;
  profileImage?: string;
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

  @ApiProperty({ description: '프로필 이미지' })
  profileImage?: string;

  constructor(id: string, name: string, sex: SexEnum, bio: string, profileImage: string) {
    this.id = id;
    this.name = name;
    this.sex = sex;
    this.bio = bio;
    this.profileImage = profileImage;
  }

  static of({ id, name, sex, bio, profileImage }: IMemberResponse): MemberResponse {
    return new MemberResponse(id, name, sex, bio, profileImage);
  }
}
