export const RoleName = {
  MEMBER: "MEMBER",
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export enum UserRole {
  MEMBER = "MEMBER",
  USER = "USER",
  ADMIN = "ADMIN",
}

// Define the Role type as an interface
export interface RoleModel {
  id: number;
  userRole: UserRole;
}

export enum Role {
  Member = "MEMBER",
  User = "USER",
  Admin = "ADMIN",
}
