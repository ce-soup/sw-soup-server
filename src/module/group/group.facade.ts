import { Injectable } from '@nestjs/common';

import { GroupService } from '@/module/group/services/group.service';
import { CreateGroupRequest } from '@/module/group/dto/request/create-group.request';
import { GroupResponse } from '@/module/group/dto/response/group.response';
import { Express } from 'express';
import { FileFacade } from '@/module/file/file.facade';
import { FileTypes } from '@/module/file/file.contants';
import { GroupRecruitmentEnum } from '@/module/group/entities/types';
import { GroupNotFoundException } from '@/module/group/exceptions/group-not-found.exception';
import { UpdateGroupRequest } from '@/module/group/dto/request/update-group.request';
import { UpdatePermissionException } from '@/module/group/exceptions/update-permission.exception';
import { GroupMemberService } from '@/module/group/group-member/services/group-member.service';
import { FullOfParticipantsException } from '@/module/group/exceptions/full-of-participants.exception';
import { AlreadyInGroupMemberException } from '@/module/group/exceptions/already-in-group-member.exception';
import { NotJoinGroupMemberException } from '@/module/group/exceptions/not-join-group-member.exception';
import { NotGroupManagerException } from '@/module/group/exceptions/not-group-manager.exception';
import { GroupMemberResponse } from '@/module/group/group-member/dto/response/group-member.response';
import { AvailableManagerRejectException } from '@/module/group/exceptions/available-manager-reject.exception';
import { FilterGroupRequest } from '@/module/group/dto/request/filter-group.request';
import { OrderGroupRequest } from '@/module/group/dto/request/order-group.request';
import { ReviewFacade } from '@/module/review/review.facade';
import { CreateReviewRequest } from '@/module/review/dto/request/create-review.request';
import { ReviewResponse } from '@/module/review/dto/response/review.response';
import { UpdateReviewRequest } from '@/module/review/dto/request/update-review.request';
import { BookmarkService } from '@/module/group/bookmark/services/bookmark.service';
import { BookmarkRequest } from '@/module/group/bookmark/dto/request/bookmark.request';

@Injectable()
export class GroupFacade {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupMemberService: GroupMemberService,
    private readonly fileFacade: FileFacade,
    private readonly reviewFacade: ReviewFacade,
    private readonly bookmarkService: BookmarkService,
  ) {}

  async getOne(id: string): Promise<GroupResponse> {
    await this.groupService.increaseViewCount(id);
    const group = await this.groupService.getById(id);
    if (!group) {
      throw new GroupNotFoundException();
    }
    const groupReviews = await this.groupService.getReviewByGroupIds(group.id);

    return GroupResponse.of(group, groupReviews);
  }

  async getAll(
    order: OrderGroupRequest,
    filter: FilterGroupRequest,
  ): Promise<GroupResponse[]> {
    const groupList = await this.groupService.getByGroupType(order, filter);

    return Promise.all(
      groupList.map(async (group) =>
        GroupResponse.of(
          group,
          await this.groupService.getReviewByGroupIds(group.id),
        ),
      ),
    );
  }

  async getPopularList(limit?: number): Promise<GroupResponse[]> {
    const groupList = await this.groupService.getPopularGroup(limit);

    return Promise.all(
      groupList.map(async (group) =>
        GroupResponse.of(
          group,
          await this.groupService.getReviewByGroupIds(group.id),
        ),
      ),
    );
  }

  async getJoinedGroup(memberId: string): Promise<GroupResponse[]> {
    const groupListIds = await this.groupMemberService
      .getByMemberId(memberId)
      .then((groupMember) => groupMember.map(({ group }) => group.id));

    const groupList = await this.groupService.getByIds(groupListIds);

    return Promise.all(
      groupList.map(async (group) =>
        GroupResponse.of(
          group,
          await this.groupService.getReviewByGroupIds(group.id),
        ),
      ),
    );
  }

  async getGroupMember(
    groupId: string,
    memberId: string,
  ): Promise<GroupMemberResponse[]> {
    const groupMemberList = await this.groupMemberService.getByGroupId(groupId);
    if (await this.isGroupManager(groupId, memberId)) {
      return groupMemberList.map((groupMember) =>
        GroupMemberResponse.of(groupMember),
      );
    }

    return groupMemberList
      .filter(({ isAccepted }) => isAccepted)
      .map((groupMember) => GroupMemberResponse.of(groupMember));
  }

  async create(
    managerId: string,
    request: CreateGroupRequest,
    image: Express.Multer.File,
  ): Promise<GroupResponse> {
    const file = image
      ? await this.fileFacade.create(FileTypes.Group, image, managerId)
      : null;
    const group = await this.groupService.create(
      managerId,
      request,
      file ? file.id : null,
    );

    await this.groupMemberService.join(group.id, managerId, true);
    const groupReviews = await this.groupService.getReviewByGroupIds(group.id);

    return GroupResponse.of(group, groupReviews);
  }

  async update(
    groupId: string,
    memberId: string,
    request: UpdateGroupRequest,
    image: Express.Multer.File,
  ): Promise<GroupResponse> {
    const group = await this.groupService.getById(groupId);
    if (group.managerId !== memberId) {
      throw new UpdatePermissionException();
    }

    const newImage = image
      ? await (async () => {
          await this.fileFacade.delete(group.image.key);
          return await this.fileFacade.create(FileTypes.Group, image, memberId);
        })()
      : null;

    const newGroup = await this.groupService.update(
      groupId,
      request,
      newImage ? newImage.id : null,
    );

    const groupReviews = await this.groupService.getReviewByGroupIds(
      newGroup.id,
    );

    return GroupResponse.of(newGroup, groupReviews);
  }

  async delete(groupId: string, memberId: string): Promise<boolean> {
    if (!(await this.isGroupManager(groupId, memberId))) {
      throw new NotGroupManagerException();
    }

    return this.groupService.delete(groupId);
  }

  async join(groupId: string, memberId: string): Promise<boolean> {
    const group = await this.groupService.getById(groupId);
    if (await this.isGroupMember(groupId, memberId)) {
      throw new AlreadyInGroupMemberException();
    }
    if (
      (await this.groupMemberService
        .getByGroupId(groupId)
        .then((res) => res.length)) >= group.personnel
    ) {
      throw new FullOfParticipantsException();
    }

    await this.groupMemberService.join(
      groupId,
      memberId,
      group.recruitment === GroupRecruitmentEnum.FirstCome ? true : null,
    );

    return true;
  }

  async cancel(groupId: string, memberId: string): Promise<boolean> {
    if (!(await this.isGroupMember(groupId, memberId))) {
      throw new NotJoinGroupMemberException();
    }

    await this.groupMemberService.cancel(groupId, memberId);

    return true;
  }

  async accept(
    groupId: string,
    managerId: string,
    memberId: string,
  ): Promise<boolean> {
    if (!(await this.isGroupManager(groupId, managerId))) {
      throw new NotGroupManagerException();
    }

    return this.groupMemberService.accept(groupId, memberId);
  }

  async reject(
    groupId: string,
    managerId: string,
    memberId: string,
  ): Promise<boolean> {
    if (!(await this.isGroupManager(groupId, managerId))) {
      throw new NotGroupManagerException();
    }
    if (await this.isGroupManager(groupId, memberId)) {
      throw new AvailableManagerRejectException();
    }

    return this.groupMemberService.reject(groupId, memberId);
  }

  async writerReview(
    memberId: string,
    groupId: string,
    request: CreateReviewRequest,
  ): Promise<ReviewResponse> {
    const [review, reviewResponse] = await this.reviewFacade.write({
      writerId: memberId,
      content: request.content,
    });

    await this.groupService.addReview(groupId, review.id);

    return reviewResponse;
  }

  async updateReview(
    memberId: string,
    reviewId: string,
    request: UpdateReviewRequest,
  ): Promise<ReviewResponse> {
    const [_, reviewResponse] = await this.reviewFacade.update({
      reviewId,
      writerId: memberId,
      content: request.content,
    });

    return reviewResponse;
  }

  async deleteReview(memberId: string, reviewId: string): Promise<true> {
    return await this.reviewFacade.delete({
      reviewId,
      memberId,
    });
  }

  async getBookmark(memberId: string): Promise<GroupResponse[]> {
    const bookmarkList = await this.bookmarkService.getByMemberId(memberId);

    return bookmarkList.map((bookmark) => GroupResponse.of(bookmark.group));
  }

  async addBookmark(
    { groupId }: BookmarkRequest,
    memberId: string,
  ): Promise<GroupResponse> {
    const group = await this.groupService.getById(groupId);
    if (!group) {
      throw new GroupNotFoundException();
    }

    await this.bookmarkService.add(memberId, groupId);

    return GroupResponse.of(group);
  }

  async deleteBookmark(
    { groupId }: BookmarkRequest,
    memberId: string,
  ): Promise<boolean> {
    const group = await this.groupService.getById(groupId);
    if (!group) {
      throw new GroupNotFoundException();
    }

    return await this.bookmarkService.delete(memberId, groupId);
  }

  private async isGroupMember(
    groupId: string,
    memberId: string,
  ): Promise<boolean> {
    return await this.groupMemberService
      .getByGroupIdAndMemberId(groupId, memberId)
      .then((res) => !!res);
  }

  private async isGroupManager(
    groupId: string,
    memberId: string,
  ): Promise<boolean> {
    const group = await this.groupService.getById(groupId);
    return group.managerId === memberId;
  }
}
