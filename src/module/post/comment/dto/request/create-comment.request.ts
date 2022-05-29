import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentRequest {
  @ApiProperty({ nullable: true }) parentId: string;
  @ApiProperty({ nullable: false }) content: string;
}
