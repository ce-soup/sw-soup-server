import { ApiProperty } from '@nestjs/swagger';

export interface IFindMemberRequest {
  id: string;
}

export class FindMemberRequest implements IFindMemberRequest {
  @ApiProperty({ description: 'id' })
  id: string;
}
