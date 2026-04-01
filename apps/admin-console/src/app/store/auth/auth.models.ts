export interface AuthUser {
  id: string;
  email: string;
  verified: boolean;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}
