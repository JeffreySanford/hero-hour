
import { Test, TestingModule } from '@nestjs/testing';
import { GameProfileService } from './game-profile.service';

describe('GameProfileService', () => {
  let service: GameProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameProfileService],
    }).compile();
    service = module.get<GameProfileService>(GameProfileService);
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

    it('should throw for non-existent quest update and invalid side-quest claim', async () => {
      const userId = 'user11';
      await service.initProfile(userId);
      await expect(service.updateQuest(userId, 'unknown-quest', { status: 'done' })).rejects.toThrow('Quest not found');
      await expect(service.claimSideQuest(userId, 'invalid')).rejects.toThrow('Side quest not found');
    });
});
