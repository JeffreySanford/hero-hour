
import { Test, TestingModule } from '@nestjs/testing';
import { promises as fs } from 'fs';
import { join } from 'path';
import { GameProfileService } from './game-profile.service';
import { TelemetryService } from '../telemetry/telemetry.service';
import { TelemetryAuditRepository } from '@org/domain';

describe('GameProfileService', () => {
  let service: GameProfileService;
  let telemetry: TelemetryService;

  const persistenceFile = join(process.cwd(), 'tmp', 'game-profile-test.json');

  beforeEach(async () => {
    process.env.GAME_PROFILE_STORE_PATH = persistenceFile;
    await fs.mkdir(join(process.cwd(), 'tmp'), { recursive: true });
    try {
      await fs.unlink(persistenceFile);
    } catch {
      // ignore missing file
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [GameProfileService, TelemetryService, TelemetryAuditRepository],
    }).compile();
    service = module.get<GameProfileService>(GameProfileService);
    telemetry = module.get<TelemetryService>(TelemetryService);
    telemetry.clear();
  });

  it('should initialize default game profile once', async () => {
    const userId = 'user1';
    const profile = await service.initProfile(userId);
    expect(profile).toBeDefined();
    expect(profile.userId).toBe(userId);
    // Try to initialize again, should not duplicate
    const profile2 = await service.initProfile(userId);
    expect(profile2).toEqual(profile);
  });

  it('should update avatar/theme/display name', async () => {
    const userId = 'user2';
    await service.initProfile(userId);
    const updated = await service.updateProfile(userId, { avatar: 'dragon', theme: 'dark', displayName: 'Hero' });
    expect(updated.avatar).toBe('dragon');
    expect(updated.theme).toBe('dark');
    expect(updated.displayName).toBe('Hero');
  });

  it('should reject duplicate initialization', async () => {
    const userId = 'user3';
    await service.initProfile(userId);
    // Should not create a new profile if one exists
    const profile = await service.initProfile(userId);
    expect(profile.userId).toBe(userId);
  });

  it('should return default progression fields', async () => {
    const userId = 'user4';
    const profile = await service.initProfile(userId);
    expect(profile.xp).toBe(0);
    expect(profile.level).toBe(1);
    expect(profile.streak).toBe(0);
  });

  it('should update selected game profile fields safely', async () => {
    const userId = 'user5';
    await service.initProfile(userId);
    const updated = await service.updateProfile(userId, { xp: 100, level: 2 });
    expect(updated.xp).toBe(100);
    expect(updated.level).toBe(2);
    // Other fields remain unchanged
    expect(updated.streak).toBe(0);
  });

  it('should provide village state and progress updates', async () => {
    const userId = 'user6';
    const initial = await service.getVillageState(userId);
    const initialTotal = initial.totalProgress;
    expect(initial.structures.length).toBeGreaterThan(0);

    const next = await service.updateVillageProgress(userId, 's1', 70);
    expect(next.totalProgress).toBeGreaterThan(initialTotal);
    expect(next.structures.find((s) => s.id === 's1')?.level).toBe(1);

    const final = await service.updateVillageProgress(userId, 's1', 40);
    expect(final.structures.find((s) => s.id === 's1')?.level).toBe(2);
  });

  it('should record questCompleted and focusSessionCompleted telemetry', async () => {
    const userId = 'user100';
    await service.initProfile(userId);
    const quest = await service.createQuest(userId, { title: 'Quest', lifeArea: 'fun', status: 'pending', progress: 50 });
    await service.updateQuest(userId, quest.id, { status: 'complete', progress: 100 });
    await service.completeFocusSession(userId, 30, 'deep-work');

    const events = telemetry.list();
    expect(events).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'questCompleted', userId }),
      expect.objectContaining({ type: 'focusSessionCompleted', userId }),
    ]));
  });

    it('should manage quests and side-quests with world state updates', async () => {
      const userId = 'user10';
      await service.initProfile(userId);
      const quest = await service.createQuest(userId, {
        title: 'Learn Tests',
        lifeArea: 'learning',
        status: 'pending',
        progress: 0,
      });
      expect(quest).toMatchObject({ userId, title: 'Learn Tests' });

      const fetchedQuests = await service.getQuests(userId);
      expect(fetchedQuests).toEqual(expect.arrayContaining([expect.objectContaining({ id: quest.id })]));

      const sideQuests = await service.getSideQuests(userId);
      expect(sideQuests.length).toBeGreaterThan(0);

      const claimed = await service.claimSideQuest(userId, sideQuests[0].id);
      expect(claimed.completed).toBe(true);

      const updatedQuest = await service.updateQuest(userId, quest.id, { progress: 30, status: 'in-progress' });
      expect(updatedQuest.progress).toBe(30);
      expect(updatedQuest.status).toBe('in-progress');

      const worldBeforeState = await service.getWorldState(userId);
      const worldBefore = { ...worldBeforeState }; // clone to avoid alias mutation by updateQuest
      await service.updateQuest(userId, quest.id, { progress: 100, status: 'complete' });
      const worldAfter = await service.getWorldState(userId);
      expect(worldAfter.progress).toBeGreaterThanOrEqual(worldBefore.progress);
      expect(worldAfter.seed).toBeGreaterThan(worldBefore.seed);

      const worldState = await service.logActivity(userId, 'exercise', 2);
      expect(worldState).toHaveProperty('seed');
      expect(worldState).toHaveProperty('progress');

      const worldAgain = await service.getWorldState(userId);
      expect(worldAgain).toEqual(worldState);
    });

    it('should log unknown activity types with baseline weight', async () => {
      const userId = 'user12';
      await service.initProfile(userId);
      const worldState = await service.logActivity(userId, 'unknown', 3);
      expect(worldState).toHaveProperty('seed');
      expect(worldState.progress).toBeGreaterThanOrEqual(0);
    });

    it('should persist data across service restarts', async () => {
      const userId = 'persistUser';
      await service.initProfile(userId);
      await service.updateProfile(userId, { xp: 123, level: 5, avatar: 'phoenix' });

      const module: TestingModule = await Test.createTestingModule({
        providers: [GameProfileService, TelemetryService, TelemetryAuditRepository],
      }).compile();
      const restartedService = module.get<GameProfileService>(GameProfileService);

      const fileContent = await fs.readFile(persistenceFile, 'utf8');
      expect(fileContent).toContain('"persistUser"');

      const reloadedProfile = await restartedService.getProfile(userId);
      expect(reloadedProfile.userId).toBe(userId);
      expect(reloadedProfile.xp).toBe(123);
      expect(reloadedProfile.level).toBe(5);
      expect(reloadedProfile.avatar).toBe('phoenix');

      const reloadedVillage = await restartedService.getVillageState(userId);
      expect(reloadedVillage.totalProgress).toBeGreaterThanOrEqual(0);
    });

    it('should completeQuest and return updated world state and profile', async () => {
      const userId = 'user14';
      await service.initProfile(userId);
      const quest = await service.createQuest(userId, { title: 'Finish report', lifeArea: 'career', status: 'pending', progress: 10 });

      const preWorld = await service.getWorldState(userId);
      const result = await service.completeQuest(userId, quest.id);

      expect(result.quest.status).toBe('complete');
      expect(result.quest.progress).toBe(100);
      expect(result.worldState.progress).toBeGreaterThanOrEqual(preWorld.progress);
      expect(result.profile.userId).toBe(userId);
      expect(result.profile.xp).toBeDefined();
    });

    it('should build strategy profile with dimensions and recommendations', async () => {
      const userId = 'user-strategy-1';
      await service.initProfile(userId);
      await service.createQuest(userId, { title: 'Q1', lifeArea: 'health', status: 'complete', progress: 100 });
      await service.createQuest(userId, { title: 'Q2', lifeArea: 'career', status: 'pending', progress: 50 });
      await service.createQuest(userId, { title: 'Q3', lifeArea: 'fun', status: 'pending', progress: 0 });

      const strategy = await service.getStrategyProfile(userId);

      expect(strategy.userId).toBe(userId);
      expect(strategy.dimensions.length).toBeGreaterThanOrEqual(3);
      expect(strategy.recommendations.length).toBeGreaterThanOrEqual(1);
      expect(strategy.reentrySummary).toContain('You have 1 completed quests');
    });

    it('should throw for non-existent quest update and invalid side-quest claim', async () => {
      const userId = 'user11';
      await service.initProfile(userId);
      await expect(service.updateQuest(userId, 'unknown-quest', { status: 'complete', progress: 50 })).rejects.toThrow('Quest not found');
      await expect(service.claimSideQuest(userId, 'invalid')).rejects.toThrow('Side quest not found');
    });

    it('should reject invalid quest update values', async () => {
      const userId = 'user13';
      await service.initProfile(userId);
      const quest = await service.createQuest(userId, {
        title: 'Validation Quest',
        lifeArea: 'fun',
        status: 'pending',
        progress: 10,
      });

      await expect(service.updateQuest(userId, quest.id, { progress: -10 })).rejects.toThrow('Quest progress must be between 0 and 100');
      await expect(service.updateQuest(userId, quest.id, { status: 'foo' as any })).rejects.toThrow('Invalid quest status');
    });

  afterAll(async () => {
    delete process.env.GAME_PROFILE_STORE_PATH;
    try {
      await fs.unlink(persistenceFile);
    } catch {
      // ignore
    }
  });
});
