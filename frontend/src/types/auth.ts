export type UserRole = "admin" | "student";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}
