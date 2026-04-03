import { Injectable, Logger } from '@nestjs/common';
import { Quest, WorldState, SideQuest, SideQuestType, LifeArea, VillageState } from './game-profile.types';
import type { TelemetryEventPayload } from '@org/api-interfaces';
import { TelemetryService } from '../telemetry/telemetry.service';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

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
  private static get dataFilePath(): string {
    if (process.env.GAME_PROFILE_STORE_PATH) {
      return process.env.GAME_PROFILE_STORE_PATH;
    }

    const cwd = process.cwd();
    const normalized = cwd.replace(/\\/g, '/');
    if (normalized.endsWith('/apps/api')) {
      return join(cwd, 'data', 'game-profile.json');
    }

    return join(cwd, 'apps', 'api', 'data', 'game-profile.json');
  }

  private readonly logger = new Logger(GameProfileService.name);

  private profiles: Map<string, GameProfile> = new Map();
  private quests: Map<string, Quest[]> = new Map();
  private sideQuests: Map<string, SideQuest[]> = new Map();
  private worldStates: Map<string, WorldState> = new Map();
  private villageStates: Map<string, VillageState> = new Map();

  private loadPromise: Promise<void> = Promise.resolve();
  private loaded = false;

  constructor(private readonly telemetryService: TelemetryService) {
    this.loadPromise = this.loadState();
  }

  private getDefaultVillageState(): VillageState {
    return {
      structures: [
        { id: 's1', name: 'Campfire', lifeArea: LifeArea.FUN, level: 1, progress: 0, unlocked: true },
        { id: 's2', name: 'Garden', lifeArea: LifeArea.HEALTH, level: 1, progress: 0, unlocked: false },
      ],
      totalProgress: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  private async loadState(): Promise<void> {
    try {
      const raw = await fs.readFile(GameProfileService.dataFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.profiles) this.profiles = new Map(Object.entries(parsed.profiles));
      if (parsed.quests) this.quests = new Map(Object.entries(parsed.quests));
      if (parsed.sideQuests) this.sideQuests = new Map(Object.entries(parsed.sideQuests));
      if (parsed.worldStates) this.worldStates = new Map(Object.entries(parsed.worldStates));
      if (parsed.villageStates) this.villageStates = new Map(Object.entries(parsed.villageStates));
      this.logger.log(`Loaded progression state from ${GameProfileService.dataFilePath}`);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // no existing file is okay
        this.logger.log(`Progression state file not found; starting with empty state`);
      } else {
        this.logger.error('Failed to load progression state', error);
      }
    } finally {
      this.loaded = true;
    }
  }

  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      await this.loadPromise;
    }
  }

  private async saveState(): Promise<void> {
    try {
      const payload = JSON.stringify({
        profiles: Object.fromEntries(this.profiles),
        quests: Object.fromEntries(this.quests),
        sideQuests: Object.fromEntries(this.sideQuests),
        worldStates: Object.fromEntries(this.worldStates),
        villageStates: Object.fromEntries(this.villageStates),
      });
      await fs.mkdir(dirname(GameProfileService.dataFilePath), { recursive: true });
      await fs.writeFile(GameProfileService.dataFilePath, payload, 'utf-8');
      this.logger.log(`Saved progression state to ${GameProfileService.dataFilePath}`);
    } catch (error) {
      this.logger.error('Failed to save progression state', error as Error);
    }
  }

  async initProfile(userId: string): Promise<GameProfile> {
    await this.ensureLoaded();
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
    if (!this.villageStates.has(userId)) {
      this.villageStates.set(userId, this.getDefaultVillageState());
    }
    await this.saveState();
    return profile;
  }

  async getVillageState(userId: string): Promise<VillageState> {
    await this.initProfile(userId);
    return this.villageStates.get(userId) ?? this.getDefaultVillageState();
  }

  async updateVillageProgress(userId: string, structureId: string, progressIncrement: number): Promise<VillageState> {
    const village = await this.getVillageState(userId);
    const structure = village.structures.find((s) => s.id === structureId);
    if (!structure) {
      throw new Error('Structure not found');
    }
    structure.progress += progressIncrement;
    if (structure.progress >= 100) {
      structure.progress = 100;
      structure.level += 1;
    }
    if (!structure.unlocked) {
      structure.unlocked = true;
    }
    village.totalProgress = village.structures.reduce((sum, s) => sum + s.progress, 0);
    village.updatedAt = new Date().toISOString();
    this.villageStates.set(userId, village);
    await this.saveState();
    return village;
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
    await this.saveState();
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

  async getProfile(userId: string): Promise<GameProfile> {
    await this.ensureLoaded();
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error('Game profile not found');
    return profile;
  }

  async updateAvatarTheme(dto: { userId: string; avatar?: string; theme?: string }): Promise<GameProfile> {
    const profile = await this.getProfile(dto.userId);
    if (dto.avatar !== undefined) profile.avatar = dto.avatar;
    if (dto.theme !== undefined) profile.theme = dto.theme;
    this.profiles.set(dto.userId, profile);
    await this.saveState();
    return profile;
  }

  async getQuests(userId: string): Promise<Quest[]> {
    await this.initProfile(userId);
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
    await this.saveState();
    return newQuest;
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

    if (updated.status === 'complete') {
      this.telemetryService.record({
        type: 'questCompleted',
        userId,
        payload: {
          userId,
          details: {
            questId: updated.id,
            title: updated.title,
            lifeArea: updated.lifeArea,
            progress: updated.progress,
          },
        } as TelemetryEventPayload,
      });

      const world = await this.getWorldState(userId);
      world.seed += 10;
      world.progress = Math.min(100, world.progress + 10);
      this.worldStates.set(userId, world);
    }

    await this.saveState();
    return updated;
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

    this.telemetryService.record({
      type: 'questCompleted',
      userId,
      payload: {
        userId,
        details: {
          questId: sideQuest.id,
          title: sideQuest.title,
          type: sideQuest.type,
          rewardXp: sideQuest.rewardXp,
        },
      } as TelemetryEventPayload,
    });

    const profile = await this.initProfile(userId);
    profile.xp += sideQuest.rewardXp;
    this.profiles.set(userId, profile);

    const world = await this.getWorldState(userId);
    world.progress = Math.min(100, world.progress + 5);
    world.seed += sideQuest.rewardXp;
    this.worldStates.set(userId, world);

    await this.saveState();
    return sideQuest;
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
    await this.saveState();
    return world;
  }

  async getWorldState(userId: string): Promise<WorldState> {
    await this.initProfile(userId);
    return this.worldStates.get(userId) ?? this.getDefaultWorldState();
  }

  async completeFocusSession(userId: string, durationMinutes: number, focusArea: string): Promise<{ userId: string; durationMinutes: number; focusArea: string; completedAt: string }> {
    await this.initProfile(userId);

    const event = {
      type: 'focusSessionCompleted' as const,
      userId,
      payload: {
        userId,
        details: { durationMinutes, focusArea },
      } as TelemetryEventPayload,
    };

    this.telemetryService.record(event);

    const world = await this.getWorldState(userId);
    world.progress = Math.min(100, world.progress + Math.min(10, Math.floor(durationMinutes / 10)));
    this.worldStates.set(userId, world);
    await this.saveState();

    return { userId, durationMinutes, focusArea, completedAt: new Date().toISOString() };
  }
}
