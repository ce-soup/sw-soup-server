import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export interface IFindMemberRequest {
  id: string;
}

export class FindMemberRequest implements IFindMemberRequest {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({ description: 'id' })
  @IsUUID()
  id: string;

  static of({ id }: IFindMemberRequest): FindMemberRequest {
    return new FindMemberRequest(id);
  }
}
