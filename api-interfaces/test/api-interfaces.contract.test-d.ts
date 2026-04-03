import { expectType, expectAssignable } from 'tsd';
import type {
  GameProfile,
  Quest,
  SideQuest,
  WorldState,
  VillageState,
  LifeArea,
  QuestStatus,
  SideQuestType,
} from '../src/lib/api-interfaces';

const profile: GameProfile = {
  userId: 'u1',
  avatar: 'basic',
  theme: 'light',
  displayName: 'HeRo',
  xp: 100,
  level: 2,
  streak: 4,
};
expectType<GameProfile>(profile);

const quest: Quest = {
  id: 'q1',
  userId: 'u1',
  title: 'verify persistence',
  lifeArea: 'career',
  status: 'pending',
  progress: 10,
};
expectType<Quest>(quest);

const sideQuest: SideQuest = {
  id: 'sq1',
  userId: 'u1',
  title: 'quick test',
  type: 'daily',
  completed: false,
  rewardXp: 10,
};
expectType<SideQuest>(sideQuest);

const world: WorldState = {
  seed: 8,
  color: 'blue',
  icon: '🌱',
  progress: 12,
};
expectType<WorldState>(world);

const village: VillageState = {
  structures: [
    {
      id: 's1',
      name: 'camp',
      lifeArea: 'fun',
      level: 1,
      progress: 25,
      unlocked: true,
    },
  ],
  totalProgress: 25,
  updatedAt: new Date().toISOString(),
};
expectType<VillageState>(village);

// Enum-like type values
expectAssignable<LifeArea>('health');
expectAssignable<QuestStatus>('complete');
expectAssignable<SideQuestType>('quick-win');
