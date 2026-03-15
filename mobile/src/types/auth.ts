export type UserRole = "admin" | "user";
export type UserAccountStatus = "active" | "suspended" | "deactivated";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: UserAccountStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface AuthTokens {
  accessToken: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
}
