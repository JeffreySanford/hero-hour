import { Injectable } from '@nestjs/common';
import { Quest, WorldState, SideQuest, SideQuestType } from './game-profile.types';

export interface GameProfile {
  userId: string;
  avatar: string;
  theme: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
}

@Injectable()
export class GameProfileService {
  private profiles: Map<string, GameProfile> = new Map();
  private quests: Map<string, Quest[]> = new Map();
  private sideQuests: Map<string, SideQuest[]> = new Map();
  private worldStates: Map<string, WorldState> = new Map();

  async initProfile(userId: string): Promise<GameProfile> {
    let profile = this.profiles.get(userId);
    if (!profile) {
      profile = {
        userId,
        avatar: 'default',
        theme: 'default',
        displayName: '',
        xp: 0,
        level: 1,
        streak: 0,
      };
      this.profiles.set(userId, profile);
    }
    if (!this.worldStates.has(userId)) {
      this.worldStates.set(userId, this.getDefaultWorldState());
    }
    return profile;
  }

  private getDefaultWorldState(): WorldState {
    return {
      seed: 1,
      color: 'blue',
      icon: '🌱',
      progress: 0,
    };
  }

  async updateProfile(userId: string, updates: Partial<Omit<GameProfile, 'userId'>>): Promise<GameProfile> {
    const profile = await this.initProfile(userId);
    if (updates.avatar !== undefined) profile.avatar = updates.avatar;
    if (updates.theme !== undefined) profile.theme = updates.theme;
    if (updates.displayName !== undefined) profile.displayName = updates.displayName;
    if (updates.xp !== undefined) profile.xp = updates.xp;
    if (updates.level !== undefined) profile.level = updates.level;
    if (updates.streak !== undefined) profile.streak = updates.streak;
    this.profiles.set(userId, profile);
    return profile;
  }

  async getProfile(userId: string): Promise<GameProfile> {
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error('Game profile not found');
    return profile;
  }

  async updateAvatarTheme(dto: { userId: string; avatar?: string; theme?: string }): Promise<GameProfile> {
    const profile = await this.getProfile(dto.userId);
    if (dto.avatar !== undefined) profile.avatar = dto.avatar;
    if (dto.theme !== undefined) profile.theme = dto.theme;
    this.profiles.set(dto.userId, profile);
    return profile;
  }

  async getQuests(userId: string): Promise<Quest[]> {
    this.initProfile(userId);
    return this.quests.get(userId) ?? [];
  }

  async createQuest(userId: string, questData: Omit<Quest, 'id' | 'userId'>): Promise<Quest> {
    await this.initProfile(userId);
    const newQuest: Quest = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userId,
      title: questData.title,
      lifeArea: questData.lifeArea,
      status: questData.status,
      progress: questData.progress,
    };
    const userQuests = this.quests.get(userId) ?? [];
    userQuests.push(newQuest);
    this.quests.set(userId, userQuests);
    return newQuest;
  }

  async getSideQuests(userId: string): Promise<SideQuest[]> {
    await this.initProfile(userId);
    if (!this.sideQuests.has(userId)) {
      this.sideQuests.set(userId, [
        { id: 'sq-1', userId, title: 'Quick setup', type: SideQuestType.QUICK_WIN, completed: false, rewardXp: 10 },
        { id: 'sq-2', userId, title: 'Daily streak quick win', type: SideQuestType.DAILY, completed: false, rewardXp: 20 },
        { id: 'sq-3', userId, title: 'Bonus explorer', type: SideQuestType.BONUS, completed: false, rewardXp: 15 },
      ]);
    }
    return this.sideQuests.get(userId) ?? [];
  }

  async claimSideQuest(userId: string, sideQuestId: string): Promise<SideQuest> {
    const existing = await this.getSideQuests(userId);
    const sideQuest = existing.find((s) => s.id === sideQuestId);
    if (!sideQuest) {
      throw new Error('Side quest not found');
    }

    if (sideQuest.completed) {
      return sideQuest; // idempotent
    }

    sideQuest.completed = true;

    const profile = await this.initProfile(userId);
    profile.xp += sideQuest.rewardXp;
    this.profiles.set(userId, profile);

    const world = await this.getWorldState(userId);
    world.progress = Math.min(100, world.progress + 5);
    world.seed += sideQuest.rewardXp;
    this.worldStates.set(userId, world);

    return sideQuest;
  }

  async updateQuest(userId: string, questId: string, updates: Partial<Omit<Quest, 'id' | 'userId'>>): Promise<Quest> {
    const userQuests = this.quests.get(userId) ?? [];
    const index = userQuests.findIndex((q) => q.id === questId);
    if (index < 0) throw new Error('Quest not found');
    const quest = userQuests[index];
    const updated: Quest = {
      ...quest,
      ...updates,
    };
    userQuests[index] = updated;
    this.quests.set(userId, userQuests);
    return updated;
  }

  async logActivity(userId: string, activityType: string, intensity: number): Promise<WorldState> {
    await this.initProfile(userId);
    const world = this.worldStates.get(userId) ?? this.getDefaultWorldState();

    const weightMap: Record<string, number> = {
      exercise: 10,
      work: 6,
      rest: 4,
      social: 8,
    };
    const weight = (weightMap[activityType] ?? 2) * intensity;
    world.seed = world.seed + weight;

    const colors = ['blue', 'green', 'gold', 'purple'];
    const icons = ['🌱', '⚡', '🔥', '🌟'];
    world.color = colors[world.seed % colors.length];
    world.icon = icons[world.seed % icons.length];

    world.progress = Math.min(100, (world.seed % 101));

    this.worldStates.set(userId, world);
    return world;
  }

  async getWorldState(userId: string): Promise<WorldState> {
    await this.initProfile(userId);
    return this.worldStates.get(userId) ?? this.getDefaultWorldState();
  }
}
