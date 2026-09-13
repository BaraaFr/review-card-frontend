export type UserRole =
  | "SUPER_ADMIN"
  | "BUSINESS_OWNER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}