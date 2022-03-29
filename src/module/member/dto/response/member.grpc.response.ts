export interface IMemberGrpcResponse {
  memberId: string;
}

export class MemberGrpcResponse implements IMemberGrpcResponse {
  memberId: string;

  constructor(memberId: string) {
    this.memberId = memberId;
  }

  static of({ memberId }: IMemberGrpcResponse): MemberGrpcResponse {
    return new MemberGrpcResponse(memberId);
  }
}
