import { Test, TestingModule } from '@nestjs/testing';
import { LifeProfileService } from './life-profile.service';

describe('LifeProfileService', () => {
  let service: LifeProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifeProfileService],
    }).compile();
    service = module.get<LifeProfileService>(LifeProfileService);
  });

  it('should create life profile for user', async () => {
    const userId = 'user1';
    const profile = await service.createProfile(userId, { roles: ['parent'] });
    expect(profile.userId).toBe(userId);
    expect(profile.roles).toContain('parent');
  });

  it('should update life roles', async () => {
    const userId = 'user2';
    await service.createProfile(userId, { roles: ['student'] });
    const updated = await service.updateProfile(userId, { roles: ['student', 'athlete'] });
    expect(updated.roles).toContain('athlete');
  });

  it('should update schedule profile without overwriting other sections', async () => {
    const userId = 'user3';
    await service.createProfile(userId, { roles: ['worker'], schedule: { morning: 'work' } });
    const updated = await service.updateProfile(userId, { schedule: { evening: 'gym' } });
    expect(updated.schedule.evening).toBe('gym');
    expect(updated.roles).toContain('worker');
  });

  it('should update priorities and frictions', async () => {
    const userId = 'user4';
    await service.createProfile(userId, { priorities: ['health'] });
    const updated = await service.updateProfile(userId, { frictions: ['procrastination'] });
    expect(updated.priorities).toContain('health');
    expect(updated.frictions).toContain('procrastination');
  });

  it('should save habit anchors', async () => {
    const userId = 'user5';
    await service.createProfile(userId, {});
    const updated = await service.updateProfile(userId, { habitAnchors: ['wake up', 'read'] });
    expect(updated.habitAnchors).toContain('read');
  });

  it('should reject invalid enum values', async () => {
    const userId = 'user6';
    await service.createProfile(userId, {});
    await expect(service.updateProfile(userId, { roles: ['invalidRole'] })).rejects.toThrow();
  });

  it('should merge partial updates without wiping existing data', async () => {
    const userId = 'user7';
    await service.createProfile(userId, { priorities: ['career'], schedule: { morning: 'study' } });
    const updated = await service.updateProfile(userId, { priorities: ['health'] });
    expect(updated.priorities).toContain('health');
    expect(updated.schedule.morning).toBe('study');
  });

  it('should return only the requesting user profile', async () => {
    const userId = 'user8';
    await service.createProfile(userId, { roles: ['parent'] });
    const profile = await service.getProfile(userId);
    expect(profile.userId).toBe(userId);
    // Should not return other users' profiles
    const other = await service.getProfile('otherUser');
    expect(other).toBeUndefined();
  });
});
