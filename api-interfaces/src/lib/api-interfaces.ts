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

export type QuestStatus = 'pending' | 'in-progress' | 'complete' | 'failed';

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

export type WeeklyChallengeStatus = 'active' | 'complete' | 'expired';

export interface WeeklyChallenge {
  id: string;
  userId: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  status: WeeklyChallengeStatus;
  rewardXp: number;
  startDate: string;
  endDate: string;
}

export interface GameProfile {
  userId: string;
  avatar: string;
  theme: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  avatarStage: 'initiate' | 'pathfinder' | 'captain' | 'legend';
  identityTitle: string;
  unlockedAvatars: string[];
  unlockedThemes: string[];
  nextMilestoneXp: number;
  nextMilestoneLabel: string;
  progressToNextMilestone: number;
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

export type TelemetryEventType =
  | 'lifeProfileUpdated'
  | 'questCompleted'
  | 'focusSessionCompleted'
  | 'strategyProfileViewed'
  | 'recommendationClicked'
  | 'weeklyChallengeCompleted'
  | 'challengeAssigned'
  | 'challengeProgressed'
  | 'challengeCompleted'
  | 'dailyBoardViewed'
  | 'progressionMilestoneReached';

export type TelemetrySource = 'angular' | 'flutter' | 'backend';

export interface TelemetryEventPayload {
  userId: string;
  details: Record<string, any>;
  source?: TelemetrySource;
  sessionId?: string;
  version?: string;
}

export interface TelemetryAggregateMetric {
  name: string;
  description: string;
  eventTypes: TelemetryEventType[];
}

export type FeatureFlagName =
  | 'weeklyChallenges'
  | 'strategyProfile'
  | 'reentryGuidance'
  | 'richerProgression';

export interface FeatureFlags {
  [key: string]: boolean;
}

export interface FeatureFlagUpdate {
  name: FeatureFlagName;
  enabled: boolean;
}

export interface StrategyDimension {
  name: string;
  score: number;
  detail: string;
}

export interface StrategyRecommendation {
  id: string;
  text: string;
  type: 'completion' | 'balance' | 'momentum';
  rationale: string;
}

export interface StrategyProfile {
  userId: string;
  updatedAt: string;
  dimensions: StrategyDimension[];
  recommendations: StrategyRecommendation[];
  reentrySummary: string;
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
