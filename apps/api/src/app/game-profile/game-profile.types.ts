export enum LifeArea {
  HEALTH = 'health',
  CAREER = 'career',
  RELATIONSHIPS = 'relationships',
  FUN = 'fun',
}

export enum QuestStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  lifeArea: LifeArea;
  status: QuestStatus;
  progress: number;
}

export enum SideQuestType {
  QUICK_WIN = 'quick-win',
  DAILY = 'daily',
  BONUS = 'bonus',
}

export interface SideQuest {
  id: string;
  userId: string;
  title: string;
  type: SideQuestType;
  completed: boolean;
  rewardXp: number;
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

export interface WeeklyChallenge {
  id: string;
  userId: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  status: 'active' | 'complete' | 'expired';
  rewardXp: number;
  startDate: string;
  endDate: string;
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

export interface WorldState {
  seed: number;
  color: string;
  icon: string;
  progress: number;
}
