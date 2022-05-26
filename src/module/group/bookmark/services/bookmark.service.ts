import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Bookmark } from '@/module/group/bookmark/entities/bookmark.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
  ) {}

  async getByMemberId(memberId: string): Promise<Bookmark[]> {
    try {
      return this.bookmarkRepository.find({
        where: { memberId },
        relations: ['group', 'group.image', 'group.category', 'group.manager'],
      });
    } catch (e) {
      console.group(`[BookmarkService.getByMemberId]`);
      console.log(e);
      console.groupEnd();
    }
  }

  async add(memberId: string, groupId: string): Promise<boolean> {
    try {
      await this.bookmarkRepository.save(Bookmark.of({ memberId, groupId }));

      return true;
    } catch (e) {
      console.group(`[BookmarkService.add]`);
      console.log(e);
      console.groupEnd();
      return false;
    }
  }

  async delete(memberId: string, groupId: string): Promise<boolean> {
    try {
      await this.bookmarkRepository
        .createQueryBuilder()
        .delete()
        .where('member_id = :memberId', { memberId })
        .andWhere('group_id = :groupId', { groupId })
        .execute();

      return true;
    } catch (e) {
      console.group(`[BookmarkService.delete]`);
      console.log(e);
      console.groupEnd();
      return false;
    }
  }
}
