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

export type LifeArea = 'health' | 'career' | 'relationships' | 'fun';

export type QuestStatus = 'pending' | 'complete' | 'failed';

export interface Quest {
  id: string;
  userId: string;
  title: string;
  lifeArea: LifeArea;
  status: QuestStatus;
  progress: number;
}

export type SideQuestType = 'quick-win' | 'daily' | 'bonus';

export interface SideQuest {
  id: string;
  userId: string;
  title: string;
  type: SideQuestType;
  completed: boolean;
  rewardXp: number;
}

export interface WorldState {
  seed: number;
  color: string;
  icon: string;
  progress: number;
}

export interface GameProfile {
  userId: string;
  avatar: string;
  theme: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
}

export interface VillageStructure {
  id: string;
  name: string;
  lifeArea: LifeArea;
  level: number;
  progress: number;
  unlocked: boolean;
}

export interface VillageState {
  structures: VillageStructure[];
  totalProgress: number;
  updatedAt: string;
}

export type TelemetryEventType = 'lifeProfileUpdated' | 'questCompleted' | 'focusSessionCompleted';

export interface TelemetryEventPayload {
  userId: string;
  details: Record<string, any>;
}

export interface TelemetryEvent {
  id: string;
  type: TelemetryEventType;
  userId: string;
  payload: TelemetryEventPayload;
  createdAt: string;
}

export function apiInterfaces(): string {
  return 'api-interfaces';
}
