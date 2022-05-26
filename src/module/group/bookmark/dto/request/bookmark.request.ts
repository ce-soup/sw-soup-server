import { ApiProperty } from '@nestjs/swagger';

export class BookmarkRequest {
  @ApiProperty() groupId: string;
}
