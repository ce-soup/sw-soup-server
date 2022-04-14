export enum Role {
  General = 'General',
  Admin = 'Admin',
}

export interface IAuthUserResponse {
  memberId: string;
  roles: Role[];
}

export class AuthUserResponse implements IAuthUserResponse {
  memberId: string;
  roles: Role[];
}
