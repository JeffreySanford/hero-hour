export enum LifeArea {
  HEALTH = 'health',
  CAREER = 'career',
  RELATIONSHIPS = 'relationships',
  FUN = 'fun',
}

export enum QuestStatus {
  PENDING = 'pending',
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

export interface WorldState {
  seed: number;
  color: string;
  icon: string;
  progress: number;
}
