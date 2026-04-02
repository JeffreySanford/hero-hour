export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
}

export type LifeRole =
  | 'leader'
  | 'member'
  | 'observer'
  | 'parent'
  | 'worker'
  | 'student'
  | 'athlete';

export type ProfileStatus = 'draft' | 'active' | 'suspended' | 'archived';

export type PrivacySetting = 'private' | 'friends' | 'workspace' | 'public';

export interface LifeProfile {
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  preferredRole: LifeRole;
  roles: LifeRole[];
  schedule: Record<string, any>;
  priorities: string[];
  frictionPoints: string[];
  habitAnchors: string[];
  status: ProfileStatus;
  privacy: PrivacySetting;
  createdAt: string;
  updatedAt: string;
}

export interface LifeProfileRequest {
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  preferredRole: LifeRole;
  roles?: LifeRole[];
  schedule?: Record<string, any>;
  priorities?: string[];
  frictionPoints?: string[];
  habitAnchors?: string[];
  privacy?: PrivacySetting;
}

export type LifeProfileResponse = LifeProfile & {
  lastUpdatedBy?: string;
};

export function apiInterfaces(): string {
  return 'api-interfaces';
}
