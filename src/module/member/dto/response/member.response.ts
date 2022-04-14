import { SexEnum } from '@/module/member/domain/member.enum';

export interface IMemberResponse {
  id: string;
  name: string;
  sex: SexEnum;
  bio: string;
  deviceTokens: string[];
}

export class MemberResponse implements IMemberResponse {
  id: string;
  name: string;
  sex: SexEnum;
  bio: string;
  deviceTokens: string[];

  constructor(id: string, name: string, sex: SexEnum, bio: string, deviceTokens: string[]) {
    this.id = id;
    this.name = name;
    this.sex = sex;
    this.bio = bio;
    this.deviceTokens = deviceTokens;
  }

  static of({ id, name, sex, bio, deviceTokens }: IMemberResponse): MemberResponse {
    return new MemberResponse(id, name, sex, bio, deviceTokens);
  }
}
