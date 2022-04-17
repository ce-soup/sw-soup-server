import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export interface IFindMemberRequest {
  id: string;
}

export class FindMemberRequest implements IFindMemberRequest {
  @ApiProperty({ description: 'id' })
  @IsUUID(4)
  id: string;
}
