import { SexEnum } from '@/module/member/domain/member.enum';

export interface ICreateMemberRequest {
  name: string;
  sex: SexEnum;
}

export class CreateMemberRequest implements ICreateMemberRequest {
  name: string;
  sex: SexEnum;

  constructor(name: string, sex: SexEnum) {
    this.name = name;
    this.sex = sex;
  }

  static of({ name, sex }: ICreateMemberRequest): CreateMemberRequest {
    return new CreateMemberRequest(name, sex);
  }
}
