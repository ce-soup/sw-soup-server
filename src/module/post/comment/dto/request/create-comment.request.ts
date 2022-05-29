import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentRequest {
  @ApiProperty({ nullable: false }) content: string;
}
